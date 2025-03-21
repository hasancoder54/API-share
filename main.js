document.addEventListener("DOMContentLoaded", () => {
    const feed = document.getElementById("feed");
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")); // Giriş yapan kullanıcı bilgisi

    // Paylaşımları yükle
    function loadPosts() {
        feed.innerHTML = ""; // Mevcut içerikleri temizle
        posts.forEach((post, index) => {
            const postDiv = document.createElement("div");
            const img = document.createElement("img");
            const sharedBy = document.createElement("p");
            const deleteButton = document.createElement("button");

            img.src = post.content;
            sharedBy.textContent = `Paylaşan: ${post.username}`;
            deleteButton.textContent = "Sil";

            deleteButton.addEventListener("click", () => {
                if (loggedInUser.name === post.username) {
                    const confirmation = confirm("Emin misiniz?");
                    if (confirmation) {
                        posts.splice(index, 1);
                        localStorage.setItem("posts", JSON.stringify(posts));
                        loadPosts();
                    }
                } else {
                    alert("Sadece kendi paylaşımınızı silebilirsiniz!");
                }
            });

            postDiv.appendChild(img);
            postDiv.appendChild(sharedBy);
            if (loggedInUser.name === post.username) {
                postDiv.appendChild(deleteButton);
            }
            feed.appendChild(postDiv);
        });
    }

    // Fotoğraf/GIF Yükle
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"]; // Sadece geçerli formatları kontrol et

        if (file && validImageTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = () => {
                posts.push({ content: reader.result, username: loggedInUser.name });
                localStorage.setItem("posts", JSON.stringify(posts));
                loadPosts();
                fileInput.value = ""; // Form sıfırlanır
            };
            reader.readAsDataURL(file);
        } else {
            alert("Yalnızca fotoğraf ve GIF yükleyebilirsiniz!");
        }
    });

    // Sayfa yüklenirken paylaşımları göster
    loadPosts();
});