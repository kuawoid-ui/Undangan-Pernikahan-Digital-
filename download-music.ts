import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

const publicDir = path.join(process.cwd(), "public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

interface Item {
  name: string;
  url: string;
}

const list: Item[] = [
  {
    name: "chopin.mp3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    name: "bach.mp3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    name: "sunset.mp3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  }
];

function downloadUrl(urlStr: string, destPath: string, depth = 0): Promise<void> {
  if (depth > 5) {
    return Promise.reject(new Error("Too many redirects"));
  }

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlStr);
    const options = {
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        "Accept": "*/*"
      }
    };

    const client = parsedUrl.protocol === "https:" ? https : http;

    client.get(options, (response) => {
      const { statusCode } = response;

      if (statusCode && statusCode >= 300 && statusCode < 400 && response.headers.location) {
        let redirectUrl = response.headers.location;
        if (!redirectUrl.startsWith("http")) {
          redirectUrl = new URL(redirectUrl, urlStr).toString();
        }
        resolve(downloadUrl(redirectUrl, destPath, depth + 1));
        return;
      }

      if (statusCode !== 200) {
        reject(new Error(`Server returned status code ${statusCode} for ${urlStr}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });

      fileStream.on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log("Starting music downloads...");
  for (const item of list) {
    const dest = path.join(publicDir, item.name);
    try {
      console.log(`Downloading '${item.name}' from ${item.url}`);
      await downloadUrl(item.url, dest);
      const stats = fs.statSync(dest);
      console.log(`Successfully downloaded '${item.name}' (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (err: any) {
      console.error(`Failed to download '${item.name}':`, err.message);
    }
  }
  console.log("Download process completed!");
}

run();
