# 实用脚本说明

## folder_renamer

### 功能
1. 遍历当前文件夹的所有子文件夹。
2. 统计每个子文件夹中的图片和视频文件数量。
3. 计算每个子文件夹的总大小。
4. 根据统计信息重命名文件夹，格式为：
   - `原文件夹名 [NPNV-xMB]`
   - `原文件夹名 [NPNV-x.xxGB]`

   说明：
   - `N`：图片数量
   - `P`：视频数量
   - `xMB` 或 `x.xxGB`：文件夹大小

### 使用方法
1. 将 `folder_renamer.bat`  放入目标文件夹。
2. 双击运行 `folder_renamer.bat`。
3. 脚本会自动处理所有子文件夹。

### 注意事项
- 文件夹大小不足 1GB 时以 MB 显示，四舍五入为整数。
- 文件夹大小超过 1GB 时以 GB 显示，保留两位小数。
- 层级判断单位： 按 GB → MB → KB → B 顺序判断，确保使用最适合的单位
- 支持的文件格式：
  - 图片：`jpg, jpeg, png, gif, bmp, tiff, webp`
  - 视频：`mp4, avi, mkv, mov, wmv, flv, webm, mpeg, mpg`

---

## 开发与编译

### 使用工具
[node2bat](https://www.npmjs.com/package/node2bat)：将 Node.js 脚本编译为 Windows 批处理脚本，无需依赖 Node.js 环境。

### 安装
确保已安装 Node.js，然后运行：
```bash
npm install node2bat -g
```

### 编译
将 Node.js 脚本编译为批处理脚本：
```bash
node2bat <file>
```
`<file>` 为 UTF-8 编码的 Node.js 脚本。

### 支持的 API
node2bat 支持以下核心 API：
- **全局对象**：`WScript, process, console, require`
- **模块**：
  - `fs`：`renameSync, mkdirSync, rmdirSync, unlinkSync, existsSync, statSync, readdirSync, readFileSync, writeFileSync`
  - `path`：`resolve, join, dirname, basename, extname`
  - `util`：`format, inspect, isArray, isString, isObject`

更多详情请参考 [node2bat 文档](https://www.npmjs.com/package/node2bat)。
