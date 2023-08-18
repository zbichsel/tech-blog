const newFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#blog-title').value;
    const content = document.querySelector('#blog-content').value;
    const date_created = new Date().toLocaleDateString();

    if (title && content) {
        const response = await fetch(`/api/blogs`, {
            method: 'POST',
            body: JSON.stringify({ title, content, date_created }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Could not create blog.');
        }
    }
};

const startUpdateHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/blogs/${id}`, {
            method: 'GET',
        });

        if (response.ok) {
            const updateTitleField = document.querySelector('#update-title');
            const updateContentField = document.querySelector('#update-content');

            const updateBlog = await response.json();

            updateTitleField.value = updateBlog.title;
            updateContentField.value = updateBlog.content;
        } else {
            alert('Could not start updating.');
        }
    }
}

const updateFormHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#update-title').value;
    const content = document.querySelector('#update-content').value;
    const date_created = new Date().toLocaleDateString();

    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const reponse = await fetch(`/api/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ title, content, date_created }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Could not update blog.');
        }
    }
};

const deleteButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/blogs/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Could not delete blog.');
        }
    }
};

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);

document.querySelector('#startUpdateBlogButton').addEventListener('click', startUpdateHandler);

document.querySelector('#updateBlogButton').addEventListener('click', updateFormHandler);

document.querySelector('#deleteBlogButton').addEventListener('click', deleteButtonHandler);