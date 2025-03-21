export function registerUser(users, userInfo) {
    const { name, email, password } = userInfo;

    if (!name || !email || !password) {
        return "Tüm alanları doldurun!";
    }

    if (users.some(user => user.name === name || user.email === email)) {
        return "Bu kullanıcı adı veya e-posta zaten kayıtlı!";
    }

    users.push(userInfo);
    localStorage.setItem("users", JSON.stringify(users));
    return "Kayıt başarılı!";
}

export function loginUser(users, loginInfo) {
    const { name, password } = loginInfo;

    const user = users.find(user => user.name === name && user.password === password);

    if (!user) {
        return "Geçersiz kullanıcı adı veya şifre!";
    }

    return user;
}