
### 安装lerna

    npm install lerna -g

示例：（@wahaha/bpm-sdk-actions）

添加@wahaha/bpm-sdk-utils到你要添加的包

    lerna add @wahaha/bpm-sdk-utils --scope=@wahaha/bpm-sdk-actions


finish...

    yarn build

注入至@wahaha/bpm-sdk

    lerna add @wahaha/bpm-sdk-actions --scope=@wahaha/bpm-sdk


发布：

    git add .
    yarn commit
    lerna publish