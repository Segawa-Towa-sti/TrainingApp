import { useEffect, useState } from 'react';

type MenuGroup = {
  id: number;
  userId: number;
  name: string;
  deletedAt: string | null;
};

function App() {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/menu-groups')
      .then((res) => res.json())
      .then((data) => setMenuGroups(data))
      .catch(() => setError('データの取得に失敗しました'));
  }, []);

  return (
    <div>
      <h1>メニューグループ一覧</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {menuGroups.length === 0 ? (
        <p>メニューグループがありません</p>
      ) : (
        <ul>
          {menuGroups.map((mg) => (
            <li key={mg.id}>{mg.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;