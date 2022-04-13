var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
const mysql = require('mysql');
const bodyparser = require('body-parser');
var session_store;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toko_hp'
});

router.get("/", authentication_mdl.is_login, function (req, res, next) {
    req.getConnection(function (err, connection) {
        var query = connection.query(
            "SELECT * FROM stok_barang",
            function (err, rows) {
                if (err) var errornya = ("Error Selecting : %s ", err);
                req.flash("msg_error", errornya);
                res.render("tabel", {
                    title: "Daftar Barang",
                    header: "Daftar Barang",
                    data: rows,
                    session_store: req.session,
                });
            }
        );
    });
});

router.post('/add', authentication_mdl.is_login, function (req, res, next) {
    console.log(req.body);
    let form = req.body;
    let sql = `INSERT INTO stok_barang (kode, foto, nama, merk, harga, deskripsi, stok) VALUES ('${form.kode}', '${form.foto}', '${form.nama}', '${form.merk}', '${form.harga}', '${form.deskripsi}', '${form.stok}')`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        req.flash("msg_info", "Berhasil menyimpan data.");
        res.redirect("/daftarbarang");
    });
});

router.get("/edit/(:id)", authentication_mdl.is_login, function (req, res, next) {
    req.getConnection(function (err, connection) {
        var query = connection.query(
          "SELECT * FROM stok_barang WHERE id=" + req.params.id,
            function (err, rows) {
                if (err) {
                var errornya = ("Error Selecting : %s ", err);
                req.flash("msg_error", errors_detail);
                res.redirect("/daftarbarang");
                } else {
                if (rows.length <= 0) {
                    req.flash("msg_error", "Data barang tidak dapat ditemukan!");
                    res.redirect("/daftarbarang");
                } else {
                    console.log(rows);
                    res.render("edit-barang", {
                    title: "Edit Stok",
                    data: rows[0],
                    session_store: req.session,
                    });
                }
                }
            }
        );
    });
});

router.post('/update/(:id)', authentication_mdl.is_login, function (req, res, next) {
    console.log(req.body);
    let form = req.body;
    let sql = `UPDATE stok_barang SET kode='${form.kode}', foto='${form.foto}', nama='${form.nama}', merk='${form.merk}', harga='${form.harga}', deskripsi='${form.deskripsi}', stok='${form.stok}' WHERE id=` + req.params.id;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        req.flash("msg_info", "Berhasil memperbarui data.");
        res.redirect("/daftarbarang");
    });
});

router.get('/delete/(:id)', authentication_mdl.is_login, function (req, res, next) {
    let sql = "DELETE FROM stok_barang WHERE id=" + req.params.id;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        req.flash("msg_info", "Berhasil menghapus data.");
        res.redirect("/daftarbarang");
    });
});

module.exports = router;