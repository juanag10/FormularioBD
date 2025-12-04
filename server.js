const express = require("express");
const sql = require("mssql");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// ✅ CONFIGURACIÓN SQL SERVER
const config = {
    server: "localhost",
    database: "FormularioBD",
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

// ✅ CONEXIÓN
sql.connect(config)
.then(() => console.log("✅ Conectado a SQL Server"))
.catch(err => console.log("❌ Error:", err));

// ✅ INSERTAR
app.post("/clientes", async (req, res) => {
    const { nombre, email, telefono } = req.body;
    await sql.query`
        INSERT INTO Cliente (nombre,email,telefono)
        VALUES (${nombre}, ${email}, ${telefono})
    `;
    res.send("Insertado");
});

// ✅ CONSULTAR
app.get("/clientes", async (req, res) => {
    const resultado = await sql.query("SELECT * FROM Cliente");
    res.json(resultado.recordset);
});

// ✅ MODIFICAR
app.put("/clientes/:id", async (req, res) => {
    const { nombre, email, telefono } = req.body;
    const id = req.params.id;

    await sql.query`
        UPDATE Cliente
        SET nombre=${nombre}, email=${email}, telefono=${telefono}
        WHERE id_cliente=${id}
    `;
    res.send("Modificado");
});

// ✅ ELIMINAR
app.delete("/clientes/:id", async (req, res) => {
    const id = req.params.id;
    await sql.query`DELETE FROM Cliente WHERE id_cliente=${id}`;
    res.send("Eliminado");
});

app.listen(3000, () => console.log("🚀 Servidor activo en http://localhost:3000"));
