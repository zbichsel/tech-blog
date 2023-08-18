const commentButtonHandler = async (event) => {
    event.preventDefault();

    const content = document.querySelector('textarea[name ="commentText"]').value;
    const blog_id = document.querySelector('input[name="blog-id"]').value;
    const date_created = new Date().toLocaleDateString();

    if (content && blog_id && date_created) {
        const response = await fetch(`/api/comments`, {
            method: 'POST',
            body: JSON.stringify({ content, blog_id, date_created }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.reload();
        } else {
            alert('Could not create comment.');
        }
    }
};

document.getElementById('addComment').addEventListener('click', commentButtonHandler);