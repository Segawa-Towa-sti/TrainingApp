// ReactからuseEffectとuseStateを取り込む
// useEffect: 画面表示時に1度実行する処理を定義する
// useState: コンポーネント内の「変わる値」を管理する
import { useEffect, useState } from 'react';

// MenuGroupのデータ型を定義する
// APIから返ってくるデータの形を明示することでタイプエラーを防ぐ
type MenuGroup = {
  id: number;
  userId: number;
  name: string;
  deletedAt: string | null;
};

function MenuGroupList() {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  // menuGroups: 一覧データを保持する変数、初期値は空配列

  const [error, setError] = useState<string | null>(null);
  // error: エラーメッセージを保持する変数、初期値はnull（エラーなし）

  const [newName, setNewName] = useState('');
  // newName: 新規作成フォームの入力内容を保持する変数

  const [editingId, setEditingId] = useState<number | null>(null);
  // editingId: 今編集中の行のidを保持する変数、nullのときは編集中の行なし

  const [editingName, setEditingName] = useState('');
  // editingName: 編集中の入力欄の内容を保持する変数

  const fetchMenuGroups = () => {
    // GET /menu-groupsを呼び出して一覧データを取得する関数
    // 作成・更新・削除の後にこの関数を呼び、画面を自動更新する
    fetch('http://localhost:3000/menu-groups')
      .then((res) => res.json())
      // レスポンスをJSONに変換する
      .then((data) => setMenuGroups(data))
      // 取得したデータでmenuGroups状態を更新する（これにより画面が再描画される）
      .catch(() => setError('データの取得に失敗しました'));
      // 失敗時はerror状態にメッセージをセットする
  };

  useEffect(() => {
    fetchMenuGroups();
    // コンポーネントが初めて画面に表示されたときに1度だけ実行する
    // []は「依存配列」で、空配列にすると初回レンダリング時のみ実行される
  }, []);

  const handleCreate = () => {
    // 作成ボタンが押されたときの処理
    if (newName.trim() === '') return;
    // 入力が空なら何もしないで終了する

    fetch('http://localhost:3000/menu-groups', {
      method: 'POST',
      // HTTPメソッドをPOSTに指定する
      headers: { 'Content-Type': 'application/json' },
      // リクエストのデータ形式がJSONであることをサーバーに伝える
      body: JSON.stringify({ name: newName.trim() }),
      // 送るデータをJSON文字列に変換する
    })
      .then((res) => res.json())
      .then(() => {
        setNewName('');
        // 作成成功したら入力欄を空に戻す
        fetchMenuGroups();
        // 一覧を再取得して画面を更新する
      })
      .catch(() => setError('作成に失敗しました'));
  };

  const handleDelete = (id: number) => {
    // 削除ボタンが押されたときの処理
    // idは削除対象のMenuGroupのid
    fetch(`http://localhost:3000/menu-groups/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchMenuGroups())
      // 削除成功したら一覧を再取得する
      .catch(() => setError('削除に失敗しました'));
  };

  const handleEditStart = (mg: MenuGroup) => {
    // 編集ボタンが押されたときの処理
    setEditingId(mg.id);
    // 編集中の行のidをセットする（これによりその行だけ入力欄が表示される）
    setEditingName(mg.name);
    // 入力欄の初期値を現在の名前にする
  };

  const handleEditCancel = () => {
    // キャンセルボタンが押されたときの処理
    setEditingId(null);
    // editingIdをnullに戻すことで入力欄を非表示に戻す
    setEditingName('');
  };

  const handleEditSave = (id: number) => {
    // 保存ボタンが押されたときの処理
    if (editingName.trim() === '') return;
    // 入力が空なら何もしないで終了する

    fetch(`http://localhost:3000/menu-groups/${id}`, {
      method: 'PATCH',
      // 部分更新なHTTPメソッド
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName.trim() }),
      // 入力欄の内容をJSON文字列に変換して送る
    })
      .then((res) => res.json())
      .then(() => {
        setEditingId(null);
        setEditingName('');
        // 編集状態をリセットする
        fetchMenuGroups();
        // 一覧を再取得して画面を更新する
      })
      .catch(() => setError('更新に失敗しました'));
  };

  return (
    <div>
      <h2>メニューグループ</h2>

      {/* errorがnullでないときだけエラーメッセージを表示する */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 新規作成フォーム */}
      <div>
        <input
          type="text"
          value={newName}
          // inputの値をnewName状態と同期する
          onChange={(e) => setNewName(e.target.value)}
          // 入力内容が変わるたびにnewName状態を更新する
          placeholder="グループ名を入力"
        />
        <button onClick={handleCreate}>作成</button>
      </div>

      {/* menuGroupsが0件のときはメッセージ、それ以外は一覧を表示する */}
      {menuGroups.length === 0 ? (
        <p>メニューグループがありません</p>
      ) : (
        <ul>
          {menuGroups.map((mg) => (
            // menuGroups配列をループして各行を表示する
            // keyはReactが各要素を識別するために必要なユニークな値
            <li key={mg.id}>
              {editingId === mg.id ? (
                // 編集中の行は入力欄と保存・キャンセルボタンを表示する
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button onClick={() => handleEditSave(mg.id)}>保存</button>
                  <button onClick={handleEditCancel}>キャンセル</button>
                </>
              ) : (
                // 編集中でない行は名前と編集・削除ボタンを表示する
                <>
                  {mg.name}
                  <button onClick={() => handleEditStart(mg)}>編集</button>
                  <button onClick={() => handleDelete(mg.id)}>削除</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// このコンポーネントを外から使えるように公開する
export default MenuGroupList;