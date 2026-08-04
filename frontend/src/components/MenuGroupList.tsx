import { useEffect, useState } from 'react';

type MenuGroup = {
  id: number;
  userId: number;
  name: string;
  deletedAt: string | null;
};

function MenuGroupList() {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const fetchMenuGroups = () => {
    fetch('http://localhost:3000/menu-groups')
      .then((res) => res.json())
      .then((data) => setMenuGroups(data))
      .catch(() => setError('データの取得に失敗しました'));
  };

  useEffect(() => {
    fetchMenuGroups();
  }, []);

  const handleCreate = () => {
    if (newName.trim() === '') return;

    fetch('http://localhost:3000/menu-groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewName('');
        fetchMenuGroups();
      })
      .catch(() => setError('作成に失敗しました'));
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:3000/menu-groups/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchMenuGroups())
      .catch(() => setError('削除に失敗しました'));
  };

  const handleEditStart = (mg: MenuGroup) => {
    setEditingId(mg.id);
    setEditingName(mg.name);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleEditSave = (id: number) => {
    if (editingName.trim() === '') return;

    fetch(`http://localhost:3000/menu-groups/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName.trim() }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditingId(null);
        setEditingName('');
        fetchMenuGroups();
      })
      .catch(() => setError('更新に失敗しました'));
  };

  return (
    <div>
      <h2>メニューグループ</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="グループ名を入力"
        />
        <button onClick={handleCreate}>作成</button>
      </div>

      {menuGroups.length === 0 ? (
        <p>メニューグループがありません</p>
      ) : (
        <ul>
          {menuGroups.map((mg) => (
            <li key={mg.id}>
              {editingId === mg.id ? (
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

export default MenuGroupList;