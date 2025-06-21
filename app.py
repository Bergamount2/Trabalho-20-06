
'''Trabalho Em Grupo até 13/06/25   -   (em 6 pessoas)
Baseado no modelo 10 - completo
1) A nova tabela criada, deve conter no mínimo 10 campos diversos, mas deve ter campos do 
tipo inteiro, string, data, valores decimais, entre outros. Também deve ter Chave Primária.
2) A página WEB deve ter no mínimo 4 caminhos (/about, /cadastro, etc).
3) Dentro da página WEB, deve ter a listagem separada da página do cadastro. 
Também deve ter no mínimo 3 elementos diferentes, tipo ComboBox, DropDown, CheckBox, etc.
4) Deve ter na página a opção para carregar/trocar a imagem de fundo da página.
5) uma atividade extra  (se fizer os 4 acima, já garante o 10.0 - Dez)
Salvar o caminho da imagem de fundo, na base de dados (tabela).
Já que esta salva, pode adicionar ela na listagem e ter uma imagem para cada cadastro.
E se agora, está na listagem, criar um botão ao lado da listagem para poder trocar a imagem para cada registro cadastrado'''
from flask import *
import sqlite3


app = Flask(__name__)


@app.route("/")
def index():
    conn = sqlite3.connect("usuarios.db", check_same_thread=False)
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS usuarios
                    (id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome VARCHAR(60) NOT NULL,
                    sexo VARCHAR(10) NOT NULL,
                    cpf VARCHAR(14) NOT NULL,
                    telefone VARCHAR(25) NOT NULL,
                    email VARCHAR(60) NOT NULL,
                    idade INTEGER NOT NULL,
                    nascimento DATE NOT NULL,
                    CEP VARCHAR(9) NOT NULL,
                    ativo BOOLEAN DEFAULT FALSE)''')
    
    return render_template("index.html")

@app.route("/cadastro")
def cadastro():
    conn = sqlite3.connect("usuarios.db", check_same_thread=False)
    c = conn.cursor()

    dados = []
    dados.append(request.args.get('nome') if request.args.get('nome') else "")
    dados.append(request.args.get('sexo') if request.args.get('sexo') else "")
    dados.append(request.args.get('cpf') if request.args.get('cpf') else "")
    dados.append(request.args.get('telefone') if request.args.get('telefone') else "")
    dados.append(request.args.get('email') if request.args.get('email') else "")
    dados.append(request.args.get('idade') if request.args.get('idade') else "")
    dados.append(request.args.get('nascimento') if request.args.get('nascimento') else "")
    dados.append(request.args.get('cep')if request.args.get('cep') else "")
    dados.append(request.args.get('ativo')if request.args.get('ativo') else "")
    
    c.execute("select * from usuarios")
    print(c.fetchall())
    
    if len(dados) > 0 and dados[0] != '':
        c.execute('''INSERT INTO usuarios (nome, sexo, cpf, telefone, email, idade, nascimento,cep ,ativo) VALUES (?,?,?,?,?,?,?,?,?)
        ''', (dados[0], dados[1],dados[2],dados[3],dados[4],dados[5],dados[6],dados[7],dados[8]))
    
    conn.commit()
    c.close()
    conn.close()
    
    return render_template("cadastro.html",dados = dados, c=c)

@app.route("/listagem")
def listagem():
    conn = sqlite3.connect("usuarios.db", check_same_thread=False)
    c = conn.cursor()
    c.execute("select * from usuarios;")
    lista_dados = ['ID','Nome','Sexo','CPF','Telefone','E-mail','Idade','Nascimento','CEP','Ativo']
    dados = c.fetchall()
    return render_template("listagem.html", dados=dados,lista_dados=lista_dados)

@app.route("/about")
def about():
    return render_template("about.html")

if __name__ == "__main__":
    app.run(debug=True)


