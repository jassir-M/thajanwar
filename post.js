



function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert('Please select an image');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('categories_name', name);
    formData.append('description', description);

    const res = await fetch('http://localhost:5000/api/add_category', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Add Category</button>
    </form>
    </div>
  );
}
