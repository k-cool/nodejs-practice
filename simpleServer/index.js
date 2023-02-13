async function getUser() {
  try {
    const res = await axios.get('./users');
    const users = res.data;
    const list = document.getElementById('list');

    list.innerHTML = '';

    Object.keys(users).map(key => {
      const userDiv = document.createElement('div');

      const span = document.createElement('span');
      span.textContent = users[key];

      const edit = document.createElement('button');
      edit.textContent = 'Edit';
      const handleClickEditBtn = async () => {
        const name = prompt('바꿀 이름을 입력하세요');
        if (!name) {
          return alert('이름을 반드시 입력하여야 합니다.');
        }

        try {
          await axios.put('/user/' + key, { name });
          getUser();
        } catch (err) {
          console.error(err);
        }
      };
      edit.addEventListener('click', handleClickEditBtn);

      const remove = document.createElement('button');
      remove.textContent = 'Remove';
      const handleClickRemoveBtn = async () => {
        try {
          await axios.delete('/user/' + key);
          getUser();
        } catch (err) {
          console.error(err);
        }
      };
      remove.addEventListener('click', handleClickRemoveBtn);

      userDiv.appendChild(span);
      userDiv.appendChild(edit);
      userDiv.appendChild(remove);
      list.appendChild(userDiv);
      console.log(res.data);
    });
  } catch (err) {
    console.error(err);
  }
}

window.onload = getUser();

const formTag = document.getElementById('form');

formTag.addEventListener('submit', async e => {
  e.preventDefault();
  const name = e.target.username.value;
  console.log(name);
  if (!name) {
    return alert('이름을 입력하세요');
  }

  try {
    await axios.post('/user', { name });
    getUser();
  } catch (err) {
    console.error(err);
  }

  e.target.username.value = '';
});
