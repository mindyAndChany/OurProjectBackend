// import { build } from "esbuild";

// await build({
// entryPoints: [path.join(rootDir, "src", "app.ts")],
//   bundle: true,
//   platform: "node",
//   target: "node24",
//   format: "esm",
//   outfile: "dist/app.js",
//   sourcemap: true,
//   external: [
//     // כל חבילות ה-production (מ-package.json) נשארות חיצוניות
//     "@nestjs/common",
//     "@nestjs/core",
//     "@nestjs/platform-express",
//     "@nestjs/sequelize",
//     "@nestjs/swagger",
//     "bcrypt",
//     "class-transformer",
//     "class-validator",
//     "cloudinary",
//     "cors",
//     "dotenv",
//     "express",
//     "knex",
//     "multer",
//     "nestjs-knex",
//     "pg",
//     "reflect-metadata",
//     "sequelize",
//     "sequelize-typescript",
//     "streamifier",
//     "swagger-jsdoc",
//     "swagger-ui-express",
//   ],
// });
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

await build({
  entryPoints: [path.join(rootDir, "src", "app.ts")],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  outfile: path.join(rootDir, "dist", "app.js"),
  sourcemap: true,
  external: [
    "@nestjs/common","@nestjs/core","@nestjs/platform-express",
    "@nestjs/sequelize","@nestjs/swagger","bcrypt",
    "class-transformer","class-validator","cloudinary",
    "cors","dotenv","express","knex","multer","nestjs-knex",
    "pg","reflect-metadata","sequelize","sequelize-typescript",
    "streamifier","swagger-jsdoc","swagger-ui-express",
  ],
});