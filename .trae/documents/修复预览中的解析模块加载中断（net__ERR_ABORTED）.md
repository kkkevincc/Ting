## 问题判断
- 该报错通常出现在开发模式下模块热重载或页面刷新过程中：浏览器正在请求某个模块（`src/services/parser/index.ts`），Vite重启/页面刷新导致请求被主动中断，出现 `net::ERR_ABORTED`。
- 若文件解析功能正常（能解析TXT/PDF/Word），此错误可视为“开发期噪音”。若解析过程被频繁中断，则需要优化加载与错误处理。

## 修复思路
1. 懒加载解析模块（避免初始渲染加载PDF.js）
- 将题目解析相关代码改为在用户选择文件时动态导入：`const parser = await import('@/services/parser')`，只在需要解析时加载。
- 作用：减少初次渲染的模块请求，降低被HMR中断的概率。

2. 解析过程取消机制
- 在 `UploadPanel` 组件为文档解析增加 `AbortController`：新文件选择时取消上一轮解析请求，规避并发导致的中断。
- 在解析函数外层 `try/catch` 区分 `AbortError` 与其他错误，提示用户重试。

3. PDF.js worker 注入与兼容
- 维持 `pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl` 的方式（`'?url'`资产路径），确保在调用 `getDocument` 前设置。
- 提供回退：若 `workerUrl` 异常，使用 `new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString()` 作为备用。

4. 错误处理与用户提示
- 在 `UploadPanel` 的 `onDoc` 增加状态提示（“解析中…”/“解析失败，请重试”）。
- 在控制台以 `console.debug` 记录中断原因，避免噪音级别的报错影响用户体验。

5. 验证与兼容
- 验证Chrome/Firefox/Safari（最新3个版本），尤其Safari下的模块请求与Worker加载。
- 在Vite开发模式下多次上传、触发HMR后确认无“功能性”中断。

## 修改点
- `src/components/UploadPanel.tsx:28` 将题目解析改为动态导入并引入取消机制；增加UI状态提示。
- `src/services/parser/index.ts:1` 确保 `workerSrc` 设置在任何 `getDocument` 调用之前；增加备用worker路径。

## 交付验证
- 启动开发服务器并上传多种文件（TXT/PDF/Docx），观察解析是否稳定。
- 人为触发HMR（修改样式），确认不再产生影响功能的中断；允许偶发的 `ERR_ABORTED` 日志但解析不受影响。