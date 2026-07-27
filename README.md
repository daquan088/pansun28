# 苏华食养状态观察卡

用户上传本人照片并主动选择饮食、睡眠、活动、压力四类近期状态，系统通过服务端调用小吉图片接口生成视觉卡，再给出仅基于自述信息的日常食养建议和私信关键词“食养”。

照片只用于生成视觉卡，不用于面相、疾病诊断或健康推断。生活建议不能替代专业医疗建议。

## 本地运行

1. 复制 `.env.example` 为 `.env`，填写服务端 `XIAOJI_API_KEY`。
2. 安装依赖：`npm install`
3. 启动前后端：`npm run dev`
4. 打开 `http://localhost:5173`

前端只调用同源 `POST /api/analyze`。API Key 仅由 Express 服务端读取，不会进入浏览器构建产物。

## 验证

- 单元与接口测试：`npm test`
- 生产构建：`npm run build`
- 生产服务：先构建，再设置 `NODE_ENV=production` 并运行 `npm start`

部署前仍需补充真实运营主体、联系方式、正式隐私政策链接及服务商数据处理条款。详见 `docs/privacy-and-compliance.md` 和 `docs/qa-checklist.md`。
