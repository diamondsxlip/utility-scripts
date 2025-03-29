var fs = require('fs');
var path = require('path');

// 支持的图片和视频扩展名
var imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'];
var videoExts = ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.mpeg', '.mpg'];

// 主函数
function main() {
    console.log('开始执行主函数...');
    var currentDir = __dirname;
    console.log('当前工作目录:', currentDir);
    var folders = fs.readdirSync(currentDir);
    console.log('发现文件夹数量:', folders.length);
    
    folders.forEach(function(folder) {
        console.log('\n--- 处理文件夹:', folder, '---');
        
        try {
            var fullPath = currentDir + path.sep + folder;
            console.log('完整路径:', fullPath);
            var stats;
            stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                console.log('确认为目录，开始处理...');
                processFolder(fullPath);
            } else {
                console.log('跳过非目录项');
            }
        } catch (e) {
            console.error('访问文件夹出错:', fullPath, '\n错误信息:', e.message);
        }
    });
    console.log('\n所有文件夹处理完成！');
}

// 处理单个文件夹
function processFolder(folderPath) {
    console.log('\n开始处理文件夹:', folderPath);
    var stats;
    try {
        stats = fs.statSync(folderPath);
        if (!stats.isDirectory()) {
            console.log('不是目录，跳过处理');
            return;
        }
    } catch (e) {
        console.error('访问文件夹失败:', e.message);
        return;
    }

    var originalName = path.basename(folderPath);
    console.log('原始文件夹名:', originalName);
    
    if (originalName.match(/ \[\d+P\d+V-\d+(?:\.\d+)?(?:MB|GB)\]$/)) {
        console.log('文件夹已处理过，跳过');
        return;
    }

    console.log('开始统计文件...');
    var result = countFiles(folderPath);
    console.log('统计结果:', {
        图片数量: result.imageCount,
        视频数量: result.videoCount,
        总大小: result.totalSize + ' bytes'
    });

    var newName = generateNewName(originalName, result);
    console.log('生成的新名称:', newName);
    
    if (newName !== originalName) {
        var newPath = path.dirname(folderPath) + path.sep + newName;
        try {
            fs.renameSync(folderPath, newPath);
            console.log('重命名成功:', newPath);
        } catch (e) {
            console.error('重命名失败:', e.message);
        }
    }
}

// 递归统计文件和大小
function countFiles(dir) {
    console.log('\n开始统计目录:', dir);
    var result = {
        imageCount: 0,
        videoCount: 0,
        totalSize: 0
    };
    
    try {
        var files = fs.readdirSync(dir);
        console.log('目录中文件数量:', files.length);
        
        files.forEach(function(file) {
            var fullPath = dir + path.sep + file;
            try {
                var stats = fs.statSync(fullPath);
                console.log('处理:', file, 
                    stats.isDirectory() ? '[目录]' : '[文件]',
                    '大小:', stats.size, 'bytes');
                
                if (stats.isDirectory()) {
                    console.log('递归处理子目录:', file);
                    var subResult = countFiles(fullPath);
                    result.imageCount += subResult.imageCount;
                    result.videoCount += subResult.videoCount;
                    result.totalSize += subResult.totalSize;
                } else {
                    var ext = path.extname(file).toLowerCase();
                    if (imageExts.indexOf(ext) !== -1) {
                        result.imageCount++;
                        console.log('找到图片:', file);
                    } else if (videoExts.indexOf(ext) !== -1) {
                        result.videoCount++;
                        console.log('找到视频:', file);
                    }
                    result.totalSize += stats.size;
                }
            } catch (e) {
                console.error('处理文件出错:', fullPath, '\n错误信息:', e.message);
            }
        });
    } catch (e) {
        console.error('读取目录失败:', dir, '\n错误信息:', e.message);
    }
    
    console.log('目录统计完成:', dir, '\n结果:', result);
    return result;
}

// 生成新文件夹名
function generateNewName(originalName, result) {
    var sizeStr;
    var sizeMB = result.totalSize / (1000 * 1000); // 转换为MB
    
    if (sizeMB < 1000) {
        sizeStr = Math.round(sizeMB) + 'MB';
    } else {
        var sizeGB = sizeMB / 1000;
        sizeStr = sizeGB.toFixed(2) + 'GB';
    }
    
    return originalName + ' [' + result.imageCount + 'P' + result.videoCount + 'V-' + sizeStr + ']';
}

// 执行主函数
main();
