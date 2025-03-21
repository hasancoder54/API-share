document.addEventListener("DOMContentLoaded", () => {
    const termsSection = document.getElementById("termsSection");
    const acceptTermsButton = document.getElementById("acceptTermsButton");
    const feed = document.getElementById("feed");
    const uploadSection = document.getElementById("uploadSection");
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const adminPanelButton = document.getElementById("adminPanelButton");
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const reports = JSON.parse(localStorage.getItem("reports")) || [];

    // Kullanım Şartlarını Kabul Et
    acceptTermsButton.addEventListener("click", () => {
        localStorage.setItem("termsAccepted", "true");

        termsSection.style.display = "none";
        feed.style.display = "block";
        uploadSection.style.display = "block";

        loadPosts();
    });

    // Kullanım Şartlarını Kontrol Et
    const termsAccepted = localStorage.getItem("termsAccepted");
    if (termsAccepted === "true") {
        termsSection.style.display = "none";
        feed.style.display = "block";
        uploadSection.style.display = "block";
        loadPosts();
    }

    // Fotoğrafları Yükle
    function loadPosts() {
        feed.innerHTML = ""; // Eski içerikleri temizle
        posts.forEach((post, index) => {
            const postDiv = document.createElement("div");
            const img = document.createElement("img");
            const downloadButton = document.createElement("button");
            const reportButton = document.createElement("button");

            img.src = post.content;
            img.style.width = "200px";
            img.style.margin = "10px";

            // İndirme Butonu
            downloadButton.textContent = "İndir";
            downloadButton.classList.add("downloadButton");
            downloadButton.addEventListener("click", () => {
                const link = document.createElement("a");
                link.href = post.content;
                link.download = "photo.jpg"; // İndirilen dosyanın adı
                link.click();
            });

            // Report Etme Butonu
            reportButton.textContent = "Rapor Et";
            reportButton.classList.add("reportButton");
            reportButton.addEventListener("click", () => reportPost(index));

            postDiv.appendChild(img);
            postDiv.appendChild(downloadButton);
            postDiv.appendChild(reportButton);
            feed.appendChild(postDiv);
        });
    }

    // Fotoğraf Paylaşımı
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const file = fileInput.files[0];
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

        if (file && validImageTypes.includes(file.type)) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageData = reader.result;

                // Aynı fotoğrafı yüklemeyi engelle
                if (posts.some(post => post.content === imageData)) {
                    alert("Bu fotoğraf zaten yüklendi!");
                    return;
                }

                posts.push({ content: imageData });
                localStorage.setItem("posts", JSON.stringify(posts));
                loadPosts();
                fileInput.value = ""; // Form sıfırlanır
            };

            reader.readAsDataURL(file);
        } else {
            alert("Yalnızca JPEG, PNG veya GIF formatındaki fotoğrafları yükleyebilirsiniz!");
        }
    });

    // Fotoğraf Raporlama
    function reportPost(index) {
        reports.push(posts[index]);
        localStorage.setItem("reports", JSON.stringify(reports));
        alert("Fotoğraf rapor edildi!");
    }

    // Yönetim Paneli
    adminPanelButton.addEventListener("click", () => {
        const password = prompt("Yönetim Paneli Şifresini Girin:");
        if (password === "Hasan12345") {
            openAdminPanel(); // Yönetim panelini aç
        } else {
            alert("Yanlış şifre!");
        }
    });

    // Yönetim Paneli Açma İşlevi
    function openAdminPanel() {
        const adminPanel = document.createElement("div");
        adminPanel.classList.add("modal");
        adminPanel.style.display = "flex";

        const adminContent = document.createElement("div");
        adminContent.classList.add("modalContent");

        const reportList = document.createElement("ul");

        reports.forEach((report, index) => {
            const listItem = document.createElement("li");
            const img = document.createElement("img");
            const deleteButton = document.createElement("button");

            img.src = report.content;
            img.style.width = "200px";
            img.style.margin = "10px";
            deleteButton.textContent = "Sil";

            deleteButton.addEventListener("click", () => {
                reports.splice(index, 1);
                localStorage.setItem("reports", JSON.stringify(reports));

                const postIndex = posts.findIndex(post => post.content === report.content);
                if (postIndex !== -1) {
                    posts.splice(postIndex, 1);
                    localStorage.setItem("posts", JSON.stringify(posts));
                }

                alert("Fotoğraf başarıyla silindi!");
                adminPanel.remove();
                openAdminPanel(); // Paneli yenile
                loadPosts(); // Ana ekrandan da kaldır
            });

            listItem.appendChild(img);
            listItem.appendChild(deleteButton);
            reportList.appendChild(listItem);
        });

        adminContent.appendChild(reportList);

        const closeButton = document.createElement("button");
        closeButton.textContent = "Kapat";
        closeButton.addEventListener("click", () => {
            adminPanel.remove();
        });

        adminContent.appendChild(closeButton);
        adminPanel.appendChild(adminContent);
        document.body.appendChild(adminPanel);
    }
});