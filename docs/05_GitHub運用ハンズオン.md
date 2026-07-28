# 05. GitHub運用ハンズオン（手を動かして学ぶ）

このドキュメントは、実際にあなたがコマンドを実行しながら、Git と GitHub の基本運用を学ぶための手順書です。

目的:
- Git リポジトリを作る
- 変更を commit する
- ブランチを切って作業する
- GitHub に push する
- Pull Request を作る準備をする

前提:
- 現在の [TrainingApp](../) は Git 未初期化
- Windows PowerShell で実行

---

## 0. 学習で理解してほしいこと

このハンズオンで特に覚えること:

1. 作業ファイルの状態を確認する
2. 変更をステージして commit する
3. 履歴を見て、何をいつ変えたか追えるようにする
4. ローカルの履歴を GitHub に共有する

学習ポイント:
- Git は「変更履歴の管理」
- GitHub は「履歴の共有場所」

---

## 1. 事前確認

PowerShell で次を実行します。

```powershell
git --version
```

確認したいこと:
- バージョンが表示されれば OK

次に、作業フォルダへ移動します。

```powershell
cd c:\Users\stuser00923\sgtw\TrainingApp
```

---

## 2. Git 初期化

### 2-1. 初期化

```powershell
git init
```

### 2-2. 初期ブランチ名を main に統一

```powershell
git branch -M main
```

### 2-3. 状態確認

```powershell
git status
```

期待結果:
- On branch main
- No commits yet

---

## 3. ユーザー情報設定

まずは全体設定を確認します。

```powershell
git config --global user.name
git config --global user.email
```

未設定なら設定します。

```powershell
git config --global user.name "あなたの名前"
git config --global user.email "あなたのメールアドレス"
```

学習ポイント:
- commit には作成者情報が必ず付きます

---

## 4. .gitignore 作成

Node.js / React / Express 学習で不要ファイルを commit しないため、.gitignore を作ります。

ファイル名: .gitignore

内容例:

```gitignore
node_modules/
dist/
build/
.env
.env.*
coverage/
*.log
.DS_Store
Thumbs.db
.vscode/
```

学習ポイント:
- .env を除外しないと秘密情報が漏れる可能性があります

---

## 5. 最初の commit

### 5-1. 変更確認

```powershell
git status
```

### 5-2. ステージ

```powershell
git add .
```

### 5-3. commit

```powershell
git commit -m "chore: initialize project docs and gitignore"
```

### 5-4. 履歴確認

```powershell
git log --oneline --decorate --graph
```

学習ポイント:
- add は「commit 対象に入れる」操作
- commit は「履歴として確定する」操作

---

## 6. GitHub リポジトリ作成

GitHub 上で次を実施します。

1. New repository を押す
2. Repository name を TrainingApp などで作成
3. README は作らず Empty で作成

注意:
- README を最初から作ると履歴が分岐しやすいので、今回は空で作る

---

## 7. リモート接続と最初の push

GitHub で表示された URL を使って、次を実行します。

```powershell
git remote add origin <GitHubのリポジトリURL>
```

確認:

```powershell
git remote -v
```

初回 push:

```powershell
git push -u origin main
```

学習ポイント:
- -u をつけると、次回から git push だけで送れるようになります

---

## 8. 実践練習: ブランチ運用

ここからが実務で最も重要です。

### 8-1. 新しいブランチ作成

```powershell
git switch -c feature/setup-azure-learning-path
```

### 8-2. 何か1ファイルを変更

例:
- [docs/04_技術選定ver3_Azure版.md](04_%E6%8A%80%E8%A1%93%E9%81%B8%E5%AE%9Aver3_Azure%E7%89%88.md) に1行追加

### 8-3. 状態確認

```powershell
git status
```

### 8-4. commit

```powershell
git add .
git commit -m "docs: refine azure learning path"
```

### 8-5. push

```powershell
git push -u origin feature/setup-azure-learning-path
```

学習ポイント:
- main へ直接作業せず、機能ごとに branch を切ると安全です

---

## 9. Pull Request の流れ（GitHub画面）

1. GitHub で Compare & pull request を押す
2. タイトルと説明を書く
3. 差分を確認する
4. Create pull request

この練習で学べること:
- 変更内容を他者に説明する力
- 差分レビューの習慣

---

## 10. よく使う確認コマンド

```powershell
git status
git log --oneline --decorate --graph --all
git branch
git remote -v
git diff
git diff --staged
```

---

## 11. つまずきやすいポイント

### 11-1. push で認証エラー
対処:
- GitHub にログイン状態を確認
- Personal Access Token を使う設定を確認

### 11-2. main に直接 commit してしまった
対処:
- 次回からは最初に git switch -c でブランチを作る

### 11-3. 何を commit するか迷う
対処:
- 1 commit = 1目的 を意識する

---

## 12. 学習タスク（自分で実施）

以下を順に実行してみてください。

- [ ] git init して main ブランチを作る
- [ ] .gitignore を作る
- [ ] 最初の commit を作る
- [ ] GitHub リポジトリを作る
- [ ] origin を設定して main を push する
- [ ] feature ブランチを切る
- [ ] 追加 commit を作って push する
- [ ] Pull Request 画面まで到達する

---

## 13. 次フェーズ

このハンズオン完了後は、次へ進みます。

1. [docs/04_技術選定ver3_Azure版.md](04_%E6%8A%80%E8%A1%93%E9%81%B8%E5%AE%9Aver3_Azure%E7%89%88.md) の構成で初期構築
2. frontend / backend / PostgreSQL(Docker) のセットアップ
3. 初回 API を作って commit / push を繰り返す

学習ポイント:
- 実装と Git 運用を同時に進めると、実務に近い学びになります
