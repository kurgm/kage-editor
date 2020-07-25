# kage-editor

The aim of this project is to port the glyph editor used on [GlyphWiki](https://glyphwiki.org/), which is currently implemented as a Flash app, into an HTML5 / JavaScript app

Flash で実装されている [GlyphWiki](https://glyphwiki.org/) のグリフエディタを HTML5 / JavaScript アプリに移植するプロジェクト

**[https://kurgm.github.io/kage-editor/](https://kurgm.github.io/kage-editor/#data=2%3A7%3A8%3A66%3A13%3A102%3A23%3A120%3A43%241%3A0%3A2%3A34%3A60%3A100%3A60%241%3A22%3A4%3A100%3A60%3A100%3A183%241%3A0%3A2%3A16%3A93%3A71%3A93%242%3A22%3A7%3A71%3A93%3A61%3A145%3A13%3A174%242%3A0%3A7%3A171%3A64%3A152%3A81%3A119%3A104%242%3A7%3A0%3A105%3A67%3A121%3A135%3A180%3A166)**

macOS 上の最新版の Chrome / Firefox / Safari で動作確認しています。

## ブックマークレット
グリフウィキの編集中画面からジャンプできるブックマークレットです。

```js
javascript:(function(l,f){l.href='https://kurgm.github.io/kage-editor/#ssl='+(l.protocol!='http:')+'&host='+l.host+'&summary='+encodeURIComponent(f[2].elements.summary.value)+['name','edittime','related','data'].map(function(k){return'&'+k+'='+f[1].elements[k].value}).join('')})(location,document.forms)
```

## 機能一覧

- 筆画・部品をクリックで選択
- 筆画・部品をCtrl+クリック or Shift+クリックで選択対象に追加/削除
- 筆画・部品をドラッグで範囲選択
- 背景をクリックで全選択解除
- 選択筆画・部品の制御点の表示
- 接続有無による制御点の色分け
- 制御点ドラッグによる編集
- 複数筆画・部品の拡大縮小
- 筆画・部品をドラッグで移動
- 選択筆画・部品の制御点の座標を表示
- 線種・頭/尾形状の編集
- 線種形状のエラー表示
- ストレッチ係数の表示/編集
- 部品分解
- コピー/カット/ペースト
- 1つ前/後を選択
- 筆画・部品の並べ替え
- 部品検索・挿入
- 部品一覧から孫検索 (Shift+クリック)
- サムネイル表示
- アンドゥ/リドゥ
- 手書き
- グリッド
- UI表示言語切替
- 書体切替
- 中心線表示
- 白抜き表示
- キーボードショートカット
  + Ctrl+A: 全選択
  + Ctrl+I: 選択反転
  + Ctrl+Z, Ctrl+Y: 元に戻す/やり直し
  + Ctrl+X, Ctrl+C, Ctrl+V: カット, コピー, ペースト
  + Del: 選択分を削除
  + 矢印キー / Ctrl+{H,J,K,L}: 選択分を1px移動 (Shift+ で5px移動)
  + Esc: 手書きモード終了, 選択解除
  + Ctrl+S: 編集終了

## 未対応の機能
- 部品自動配置（不要？）
- 回転・反転の追加

## 翻訳 / Translation

翻訳データは [src/locales/](src/locales/) フォルダ内のJSONファイルで管理されています。
翻訳に誤りを発見した場合は報告・修正にご協力いただけると非常に助かります。

Localized messages are maintained as JSON files under [src/locales/](src/locales/) folder. Feedback or correction of mistranslations is greatly appreciated if you find any.
