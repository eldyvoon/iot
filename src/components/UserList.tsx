/**
 * Task 3: Performance Issues Fixed
 * 1. Stale closure: setCount(count + 1) → setCount(prev => prev + 1)
 * 2. Unnecessary re-renders: Memoized user list with React.memo
 * 3. Inline handler: Wrapped with useCallback
 * 4. No error handling: Added loading/error states
 */

import { useState, useEffect, useCallback, memo } from "react";

interface User {
  id: number;
  name: string;
}

const UserListItems = memo(({ users }: { users: User[] }) => {
  const [listRenderCount, setListRenderCount] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setListRenderCount((c) => c + 1));
    return () => cancelAnimationFrame(id);
  }, [users]);

  return (
    <div>
      <div className="render-meta">List renders: {listRenderCount}</div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
});
UserListItems.displayName = "UserListItems";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://jsonplaceholder.typicode.com/users", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setRenderCount((c) => c + 1));
    return () => cancelAnimationFrame(id);
  }, [count, users, loading, error]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="render-meta render-meta--spaced">
        Component renders: {renderCount}
      </div>
      <button onClick={handleIncrement}>Add +1 (clicks: {count})</button>
      <UserListItems users={users} />
    </div>
  );
};

export default UserList;
