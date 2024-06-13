export const fetchArticles = async () => {
  const response = await fetch('http://localhost:8000/api/news/fetch_articles/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  const data = await response.json();
  console.log(data)
  return data.articles;
};
