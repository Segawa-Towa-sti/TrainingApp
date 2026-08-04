import { useEffect, useState } from 'react';

type Exercise = {
  id: number;
  name: string;
  deletedAt: string | null;
};

function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const fetchExercises = () => {
    fetch('http://localhost:3000/exercises')
      .then((res) => res.json())
      .then((data) => setExercises(data))
      .catch(() => setError('データの取得に失敗しました'));
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleCreate = () => {
    if (newName.trim() === '') return;

    fetch('http://localhost:3000/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
      .then((res) => res.json())
      .then(() => {
        setNewName('');
        fetchExercises();
      })
      .catch(() => setError('作成に失敗しました'));
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:3000/exercises/${id}`, {
      method: 'DELETE',
    })
      .then(() => fetchExercises())
      .catch(() => setError('削除に失敗しました'));
  };

  const handleEditStart = (ex: Exercise) => {
    setEditingId(ex.id);
    setEditingName(ex.name);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleEditSave = (id: number) => {
    if (editingName.trim() === '') return;

    fetch(`http://localhost:3000/exercises/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editingName.trim() }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditingId(null);
        setEditingName('');
        fetchExercises();
      })
      .catch(() => setError('更新に失敗しました'));
  };

  return (
    <div>
      <h2>種目管理</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="種目名を入力"
        />
        <button onClick={handleCreate}>作成</button>
      </div>

      {exercises.length === 0 ? (
        <p>種目がありません</p>
      ) : (
        <ul>
          {exercises.map((ex) => (
            <li key={ex.id}>
              {editingId === ex.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <button onClick={() => handleEditSave(ex.id)}>保存</button>
                  <button onClick={handleEditCancel}>キャンセル</button>
                </>
              ) : (
                <>
                  {ex.name}
                  <button onClick={() => handleEditStart(ex)}>編集</button>
                  <button onClick={() => handleDelete(ex.id)}>削除</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExerciseList;