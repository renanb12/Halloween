document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado para ver esta página.");
        window.location.href = 'login.html';
        return;
    }

    // Carrega as informações do usuário
    try {
        const response = await fetch('http://localhost:3000/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar as informações do usuário.');
        }

        const userData = await response.json();
        document.getElementById('user-name').textContent = userData.name;
        document.getElementById('user-email').textContent = userData.email;
        document.getElementById('user-maxScore').textContent = userData.maxScore;
        document.getElementById('user-minScore').textContent = userData.minScore;
        document.getElementById('user-score').textContent = userData.score;
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar as informações do usuário.');
    }

    // Lógica para alterar a senha
    document.getElementById('change-password-btn').addEventListener('click', async () => {
        const newPassword = document.getElementById('new-password').value;

        if (!newPassword) {
            alert("Por favor, insira uma nova senha.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/user/password', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword })
            });

            if (response.ok) {
                alert('Senha alterada com sucesso!');
            } else {
                alert('Erro ao alterar a senha.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao alterar a senha.');
        }
    });

    // Lógica para excluir a conta
    document.getElementById('delete-account-btn').addEventListener('click', async () => {
        const confirmation = confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.");

        if (!confirmation) return;

        try {
            const response = await fetch('http://localhost:3000/user', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Conta excluída com sucesso.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            } else {
                alert('Erro ao excluir a conta.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir a conta.');
        }
    });
});
