const BaseHandle = require("./BaseHandle");
const url = require("url");
const qs = require("qs");
const fs = require("fs");
const cookie = require('cookie');
let formidable = require('formidable');

// const express = require('express')
class Handle extends BaseHandle {
    async showDashboard(req, res) {
        let html = await this.getTemplate('./src/view/dashboard.html');
        res.write(html)
        res.end();
    }

    async showHome(req, res) {
        let html = await this.getTemplate('./src/view/index.html');
        res.write(html)
        res.end();
    }
    async showNamiya(req, res) {
        let html = await this.getTemplate('./src/view/book2.html');
        res.write(html)
        res.end();
    }
    async showThePrince(req, res) {
        let html = await this.getTemplate('./src/view/book3.html');
        res.write(html)
        res.end();
    }
    async showSapien(req, res) {
        let html = await this.getTemplate('./src/view/book4.html');
        res.write(html)
        res.end();
    }
    async about(req, res) {
        let html = await this.getTemplate('./src/view/introduz.html');
        res.write(html)
        res.end();
    }

    async showBookList(req, res) {
        let html = await this.getTemplate('./src/view/productList.html');
        // truy van csdl
        let sql1 = 'SELECT id, name, price, status, decription, detail, img FROM bookproducts';
        let products = await this.querySQL(sql1);
        // tao giao  dien su dung data truy van trong csdl
        let newHTML = '';
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><b>${products.name}</b></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.decription}</td>`;
            newHTML += `<td>${products.detail}</td>`;
            newHTML += `<td><img src='${products.img}' width="200px" height="200px"/></td>`;
            newHTML += `<td><a href="/order?id=${products.id}" class="btn btn-outline-success">Order</a></td>`
            newHTML += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-Product}', newHTML)
        res.write(html)
        //tra ve response
        res.end();
    }

    async showSearchListUsers(req, res) {
        let html = await this.getTemplate('./src/view/users/UserList.html');
        // truy van csdl table user
        let sqlUser = `SELECT id, name, username, email, role, phone
                       FROM users
                       where name like '%${name}%'`;
        let usersSearch = await this.querySQL(sqlUser);
        // tao giao  dien su dung data truy van trong csdl table user
        let newHTMLUSER = '';
        usersSearch.forEach((user, index) => {
            newHTMLUSER += '<tr>';
            newHTMLUSER += `<td>${index + 1}</td>`;
            newHTMLUSER += `<td><b>${user.name}</td>`;
            newHTMLUSER += `<td><b>${user.username}</td>`;
            newHTMLUSER += `<td>${user.email}</td>`;
            newHTMLUSER += `<td>${(user.role == 1) ? 'admin' : 'user'}</td>`;
            newHTMLUSER += `<td>${user.phone}</td>`;
            newHTMLUSER += `<td>
                          
                            <a href="/admin/users/update?id=${user.id}" class="btn btn-warning">Update</a>
                            <a onclick="return confirm('Are you sure you want to delete this user?')" href="/admin/users/delete?id=${user.id}" class="btn btn-danger">Delete</a>
                        </td>`;
            newHTMLUSER += '</tr>';
        });
        html = html.replace('{list-user}', newHTMLUSER)
        res.write(html)
        //tra ve response
        res.end();
    }


    async showListUsers(req, res) {
        let html = await this.getTemplate('./src/view/users/UserList.html');
        // truy van csdl table user
        let sqlUser = 'SELECT id, name, username, email, role, phone FROM users';
        let users = await this.querySQL(sqlUser);

        // tao giao  dien su dung data truy van trong csdl table user
        let newHTMLUSER = '';
        users.forEach((user, index) => {
            newHTMLUSER += '<tr>';
            newHTMLUSER += `<td>${index + 1}</td>`;
            newHTMLUSER += `<td><b>${user.name}</td>`;
            newHTMLUSER += `<td><b>${user.username}</td>`;
            newHTMLUSER += `<td>${user.email}</td>`;
            newHTMLUSER += `<td>${(user.role == 1) ? 'admin' : 'user'}</td>`;
            newHTMLUSER += `<td>${user.phone}</td>`;
            newHTMLUSER += `<td>
                          
                            <a href="/admin/users/update?id=${user.id}" class="btn btn-warning">Update</a>
                            <a onclick="return confirm('Are you sure you want to delete this user?')" href="/admin/users/delete?id=${user.id}" class="btn btn-danger">Delete</a>
                        </td>`;
            newHTMLUSER += '</tr>';
        });
        // truy van csdl table product
        // truy van csdl table user
        let sqlProducts = 'SELECT id, name, price, status, decription, detail, quantity, category FROM bookproducts';
        let product = await this.querySQL(sqlProducts);
        // tao giao  dien su dung data truy van trong csdl table user
        let newHTMLProducts = '';
        product.forEach((product, index) => {
            newHTMLProducts += '<tr>';
            newHTMLProducts += `<td>${index + 1}</td>`;
            newHTMLProducts += `<td><b>${product.name}</b></td>`;
            newHTMLProducts += `<td><b>${product.category}</b></td>`;
            newHTMLProducts += `<td>${product.price}</td>`;
            newHTMLProducts += `<td>${product.quantity}</td>`;
            newHTMLProducts += `<td>${product.decription}</td>`;
            newHTMLProducts += `<td>
                            <a href="/admin/boook/update?id=${product.id}" class="btn btn-warning">Update</a>
                        </td>`;
            newHTMLProducts += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-user}', newHTMLUSER)
        html = html.replace('{list-products}', newHTMLProducts)
        res.write(html)
        //tra ve response
        res.end();
    }

    async deleteUser(req, res) {
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;
        let sql = 'DELETE FROM users WHERE id = ' + id;
        await this.querySQL(sql);
        res.writeHead(301, {Location: '/admin/users'});
        res.end();
    }

    async deleteBoook(req, res) {
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;
        let sql = 'DELETE FROM bookproducts WHERE id = ' + id;
        await this.querySQL(sql);
        res.writeHead(301, {Location: '/admin/users'});
        res.end();
    }

    async showFormCreateUser(req, res) {
        let html = await this.getTemplate('./src/view/users/addUser.html');
        res.write(html)
        res.end();
    }

    async showFormCreateBook(req, res) {
        let html = await this.getTemplate('./src/view/users/addBook.html');
        res.write(html)
        res.end();
    }

    async storeUser(req, res) {
        // lay du  lieu tu  form
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `CALL addUser('${dataForm.name}','${dataForm.username}', '${dataForm.email}', '${dataForm.password}', '${dataForm.role}', '${dataForm.phone}', '${dataForm.address}')`
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/admin/users'});
            res.end();
        })
    }

    async storeBook(req, res) {
        // lay du  lieu tu  form
        let bookData = '';
        req.on('data', chunk => {
            bookData += chunk
        })

        req.on('end', async () => {
            let bookdataa = qs.parse(bookData);
            let sqlInsertBook = `insert into bookproducts (name, price, status, decription, detail, author, category) value ('${bookdataa.name}',${bookdataa.price},${bookdataa.status},'${bookdataa.decription}','${bookdataa.detail}','${bookdataa.author}','${bookdataa.category}')`
            await this.querySQL(sqlInsertBook);
            res.writeHead(301, {Location: '/admin/users'});
            res.end();
        })
    }

    async showFormUpdateUser(req, res) {
        let html = await this.getTemplate('./src/view/users/updateUser.html');
        // thuc hien truy van
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;
        let sql = 'SELECT * FROM users WHERE id = ' + id;
        let data = await this.querySQL(sql);
        html = html.replace('{name}', data[0].name)
        html = html.replace('{username}', data[0].username)
        html = html.replace('{email}', data[0].email)
        html = html.replace('{address}', data[0].address)
        html = html.replace('{phone}', data[0].phone)
        html = html.replace('{id}', data[0].id)

        let roleHTML = `
            <option ${(data[0].role == 1) ? 'selected' : ''} value="1">Admin</option>
            <option ${(data[0].role == 2) ? 'selected' : ''} value="2">User</option>
        `;

        html = html.replace('{role}', roleHTML)
        res.write(html)
        res.end();
    }

    async showFormUpdateBook(req, res) {
        let htmlBookUpdate = await this.getTemplate('./src/view/users/updateBook.html');
        // thuc hien truy van
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;

        let sql = 'SELECT * FROM bookproducts WHERE id = ' + id;
        let data = await this.querySQL(sql);

        htmlBookUpdate = htmlBookUpdate.replace('{name}', data[0].name)
        htmlBookUpdate = htmlBookUpdate.replace('{price}', data[0].price)
        htmlBookUpdate = htmlBookUpdate.replace('{decription}', data[0].decription)
        htmlBookUpdate = htmlBookUpdate.replace('{author}', data[0].author)
        htmlBookUpdate = htmlBookUpdate.replace('{quantity}', data[0].quantity)
        htmlBookUpdate = htmlBookUpdate.replace('{detail}', data[0].detail)
        htmlBookUpdate = htmlBookUpdate.replace('{id}', data[0].id)
        htmlBookUpdate = htmlBookUpdate.replace('{id1}', data[0].id)


        let roleHTML = `
            <option ${(data[0].category == 'Sách Triết Học') ? 'selected' : ''} value="Sách Triết Học">Sách Triết Học</option>
            <option ${(data[0].category == 'Sách Lịch Sử') ? 'selected' : ''} value="Sách Lịch Sử">Sách Lịch Sử</option>
            <option ${(data[0].category == 'Truyện') ? 'selected' : ''} value="Truyện">Truyện</option>
            <option ${(data[0].category == 'Sách Giáo Dục') ? 'selected' : ''} value="Sách Giáo Dục">Sách Giáo Dục</option>


        `;

        htmlBookUpdate = htmlBookUpdate.replace('{role}', roleHTML)
        res.write(htmlBookUpdate)
        res.end();
    }

    async updateUser(req, res) {
        let query = url.parse(req.url).query;
        let id = qs.parse(query).id;
        // lay du  lieu tu  form
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `update users
                       set name    = '${dataForm.name}',
                           role    = '${dataForm.role}',
                           address = '${dataForm.address}',
                           phone   = '${dataForm.phone}'
                       where id = '${id}'`
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/admin/users'});
            res.end();
        })
    }

    async updateBook(req, res) {
        let queryofBook = url.parse(req.url).query;
        let idofBook = qs.parse(queryofBook).id;
        // lay du  lieu tu  form
        let dataofBook = '';
        req.on('data', chunk => {
            dataofBook += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(dataofBook);

            let sqlupdateBook = `update bookproducts
                                 set name       = '${dataForm.name}',
                                     price      = ${dataForm.price},
                                     quantity   = ${dataForm.quantity},
                                     category   = '${dataForm.category}',
                                     decription = '${dataForm.decription}',
                                     detail     = '${dataForm.detail}'
                                 where id = '${idofBook}'`
            await this.querySQL(sqlupdateBook);

            res.writeHead(301, {Location: '/admin/users'});
            res.end();
        })
    }

    async showFormLogin(req, res) {
        let html = await this.getTemplate('./src/view/login.html');
        res.write(html)
        res.end();
    }

    async showFormChangePass(req, res) {
        let html = await this.getTemplate('./src/view/changePass.html');
        res.write(html)
        res.end();
    }


    async login(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `SELECT name, username, email, phone, role
                       FROM users
                       WHERE username = '${dataForm.username}'
                         AND password = '${dataForm.password}'`;
            let result = await this.querySQL(sql);
            if (result.length == 0) {
                res.writeHead(301, {Location: '/admin/login'})
                return res.end();
            } else {
                if (result[0].role == 1) {

                    // tao session luu thong tin dang nhap
                    // tao ten file session
                    var nameFileSessions = result[0].username + '.txt';
                    let dataSession = JSON.stringify(result[0]);

                    await this.writeFile('./sessions/' + nameFileSessions, dataSession)

                    // tao cookie
                    // gan cookie vao header res
                    res.setHeader('Set-Cookie', 'u_user=' + result[0].username);
                    // res.setHeader('Set-Cookie','u_user', String(result[0].username), {
                    //     httpOnly: true,
                    //     maxAge: 20 * 20 * 7
                    // }));

                    res.writeHead(301, {Location: '/admin/users'});
                    return res.end()
                } else if (result[0].role == 2) {

                    let html = await this.getTemplate('./src/view/productList.html');
                    // truy van csdl
                    let sql1 = 'SELECT id, name, price, status, decription, detail, img FROM bookproducts';
                    let products = await this.querySQL(sql1);
                    // tao giao  dien su dung data truy van trong csdl
                    let newHTML = '';
                    products.forEach((products, index) => {
                        newHTML += '<tr>';
                        newHTML += `<td>${index + 1}</td>`;
                        newHTML += `<td><b>${products.name}</b></td>`;
                        newHTML += `<td>${products.price}</td>`;
                        newHTML += `<td>${products.decription}</td>`;
                        newHTML += `<td>${products.detail}</td>`;
                        newHTML += `<td><img src='${products.img}' width="200px" height="200px"/></td>`;
                        newHTML += `<td><a href="/order?id=${products.id}" class="btn btn-outline-success">Order</a></td>`
                        newHTML += '</tr>';
                    });
                    // lay data sql thay doi html
                    html = html.replace('{list-Product}', newHTML)
                    res.write(html)
                    //tra ve response
                    res.end();
                }
            }
        })
    }

    async order(req, res) {
        let queryofBook = url.parse(req.url).query;
        let idofBook = qs.parse(queryofBook).id;
        let sql = `select id, name, price, author
                   from bookproducts
                   where id = '${idofBook}'`
        let dataofbook = await this.querySQL(sql);
        console.log(dataofbook[0].name)
        let sqlorder = `INSERT INTO bookorder (name, price, author)
                        VALUES ('${dataofbook[0].name}', '${dataofbook[0].price}', '${dataofbook[0].author}');`
        await this.querySQL(sqlorder);
        let html = await this.getTemplate('./src/view/productList.html');
        // truy van csdl
        let sql1 = 'SELECT id, name, price, status, decription, detail, img FROM bookproducts';
        let products = await this.querySQL(sql1);
        // tao giao  dien su dung data truy van trong csdl
        let newHTML = '';
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><b>${products.name}</b></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.decription}</td>`;
            newHTML += `<td>${products.detail}</td>`;
            newHTML += `<td><img src='${products.img}' width="200px" height="200px"/></td>`;
            newHTML += `<td><a href="/order?id=${products.id}" class="btn btn-outline-success">Order</a></td>`
            newHTML += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-Product}', newHTML)
        res.write(html)
        //tra ve response
        res.end();


    }

    async showBookLichsu(req, res) {
        let html = await this.getTemplate('./src/view/productList.html');
        // truy van csdl
        let sql1 = 'SELECT id, name, price, status, decription, detail, img FROM bookproducts where category = "Sách Lịch Sử"';
        let products = await this.querySQL(sql1);
        // tao giao  dien su dung data truy van trong csdl
        let newHTML = '';
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><b>${products.name}</b></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.decription}</td>`;
            newHTML += `<td>${products.detail}</td>`;
            newHTML += `<td><img src='${products.img}' width="200px" height="200px"/></td>`;
            newHTML += `<td><a href="/order?id=${products.id}" class="btn btn-outline-success">Order</a></td>`
            newHTML += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-Product}', newHTML)
        res.write(html)
        //tra ve response
        res.end();
    }

    async showBookTrietHoc(req, res) {
        let html = await this.getTemplate('./src/view/productList.html');
        // truy van csdl
        let sql1 = 'SELECT id, name, price, status, decription, detail, img FROM bookproducts where category = "Sách Triết Học"';
        let products = await this.querySQL(sql1);
        // tao giao  dien su dung data truy van trong csdl
        let newHTML = '';
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><b>${products.name}</b></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.decription}</td>`;
            newHTML += `<td>${products.detail}</td>`;
            newHTML += `<td><img src='${products.img}' width="200px" height="200px"/></td>`;
            newHTML += `<td><a href="/order?id=${products.id}" class="btn btn-outline-success">Order</a></td>`
            newHTML += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-Product}', newHTML)
        res.write(html)
        //tra ve response
        res.end();
    }

    async showBookgiaoduc(req, res) {
        let html = await this.getTemplate('./src/view/productList.html');
        // truy van csdl
        let sql1 = 'SELECT id, name, price, status, decription, detail, img FROM bookproducts where category = "Sách Giáo Dục"';
        let products = await this.querySQL(sql1);
        // tao giao  dien su dung data truy van trong csdl
        let newHTML = '';
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><b>${products.name}</b></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.decription}</td>`;
            newHTML += `<td>${products.detail}</td>`;
            newHTML += `<td><img src='${products.img}' width="200px" height="200px"/></td>`;
            newHTML += `<td><a href="/order?id=${products.id}" class="btn btn-outline-success">Order</a></td>`
            newHTML += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-Product}', newHTML)
        res.write(html)
        //tra ve response
        res.end();
    }

    async showBooktruyen(req, res) {
        let html = await this.getTemplate('./src/view/productList.html');
        // truy van csdl
        let sql1 = 'SELECT id, name, price, status, decription, detail, img FROM bookproducts where category = "Truyện"';
        let products = await this.querySQL(sql1);
        // tao giao  dien su dung data truy van trong csdl
        let newHTML = '';
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><b>${products.name}</b></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.decription}</td>`;
            newHTML += `<td>${products.detail}</td>`;
            newHTML += `<td><img src='${products.img}' width="200px" height="200px"/></td>`;
            newHTML += `<td><a href="/order?id=${products.id}" class="btn btn-outline-success">Order</a></td>`
            newHTML += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-Product}', newHTML)
        res.write(html)
        //tra ve response
        res.end();
    }

    async showFormRegister(req, res) {
        let html = await this.getTemplate('./src/view/register.html');
        res.write(html)
        res.end();
    }

    async createUser(req, res) {
        // lay du  lieu tu  form
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `insert into users (name, username, email, password, role, phone, address)
                       values ('${dataForm.name}', '${dataForm.username}', '${dataForm.email}', '${dataForm.password}',
                               2, '${dataForm.phone}', '${dataForm.address}')`
            await this.querySQL(sql);
            res.writeHead(301, {Location: '/admin/login'});
            res.end();
        })
    }

    async changePass(req, res) {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async () => {
            let dataForm = qs.parse(data);
            let sql = `select password
                       from users
                       where username = '${dataForm.username}'`
            let oldpassword = await this.querySQL(sql);
            if (oldpassword[0].password == dataForm.oldpassword) {
                let sqlupdate = `update users
                                 set password = '${dataForm.newpassword}'
                                 where username = '${dataForm.username}'`
                await this.querySQL(sqlupdate);
                res.writeHead(301, {Location: '/admin/login'});
                res.end();
            } else {
                res.writeHead(301, {Location: '/changePass'}, function () {
                    alert('Sai Mật Khẩu')
                });
                res.end();
            }
        })
    }

    async logout(req, res) {

        // let cookies = req.headers.cookie;
        //
        // let dataCookie = cookie.parse(cookies);
        console.log(nameFileSessions)
        // let nameSession = dataCookie.u_user;
        //  fs.unlink('./sessions/' + nameFileSessions + '.txt', () => {
        res.writeHead(301, {'Location': '/admin/login'});
        res.end();
        // })

    }

    async showBooksearch(req, res) {
        let html = await this.getTemplate('./src/view/productList.html');
        let queryofBook = url.parse(req.url).query;
        let nameofBook = qs.parse(queryofBook).search;
        let sql = `SELECT id, name, price, status, decription, detail, img
                   FROM bookproducts
                   where name like '%${nameofBook}%'`
        let products = await this.querySQL(sql);
        let newHTML = '';
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><b>${products.name}</b></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.decription}</td>`;
            newHTML += `<td>${products.detail}</td>`;
            newHTML += `<td><img src='${products.img}' width="200px" height="200px"/></td>`;
            newHTML += `<td><a href="/order?id=${products.id}" class="btn btn-outline-success">Order</a></td>`
            newHTML += '</tr>';
        });
        // lay data sql thay doi html
        html = html.replace('{list-Product}', newHTML)
        res.write(html)
        //tra ve response
        res.end();
    }

    async showorder(req, res) {
        let html = await this.getTemplate('./src/view/orderList.html');
        // truy van csdl
        let sql = 'SELECT * FROM bookorder';
        let totalPriceSql = 'select sum(price) as totalprice from bookorder;';
        let products = await this.querySQL(sql);
        let totalprice = await this.querySQL(totalPriceSql)
        // tao giao  dien su dung data truy van trong csdl
        let newHTML = '';
        let totalPriceHTML = `<div class="card-body"><b>Total Payment Amount: </b> ${totalprice[0].totalprice} VNĐ</div>`;
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><label for="${products.id}"><b>${products.name}</b></label></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.author}</td>`;
            newHTML += `<td><a href="/deleteItemOrderList?id=${products.id}" class="btn btn-danger">Delete</a></td>`
        });
        // lay data sql thay doi html
        html = html.replace('{total-price}', totalPriceHTML)
        html = html.replace('{list-Product}', newHTML)

        res.write(html)
        //tra ve response
        res.end();
    }
    async deleteItemOderList(req, res){
        let queryofBookOder = url.parse(req.url).query;
        let idofBookOder = qs.parse(queryofBookOder).id;
        let sql = 'DELETE FROM bookorder WHERE id = ' + idofBookOder;
        await this.querySQL(sql);
        res.writeHead(301, {Location: '/userorder'});
        res.end();
    }
    async inserOrderToDatabase(req,res){
        let data = url.parse(req.url).query
        let dataOrder = qs.parse(data);
        console.log(dataOrder.name)
        let sqlUpdate = `UPDATE bookorder SET fulname = '${dataOrder.name}',phone = '${dataOrder.phone}', address = '${dataOrder.address}'`
        await this.querySQL(sqlUpdate);
        res.writeHead(301, {Location: '/'});
        res.end();
    }
    async viewOrder(req,res){
        let html = await this.getTemplate('./src/view/orderView.html');
        let sqlFulName = 'SELECT fulname, phone, address FROM bookorder';
        let fullName = await this.querySQL(sqlFulName);
        console.log(fullName[0])
        let sql1 = 'SELECT name, price, author FROM bookorder';
        let products = await this.querySQL(sql1);
        let newHTML = '';
        products.forEach((products, index) => {
            newHTML += '<tr>';
            newHTML += `<td>${index + 1}</td>`;
            newHTML += `<td><b>${products.name}</b></td>`;
            newHTML += `<td>${products.price}</td>`;
            newHTML += `<td>${products.author}</td>`;
        });
        // lay data sql thay doi html
        html = html.replace('{list-Product}', newHTML)
        html = html.replace('{full-name}', fullName[0].fulname)
        html = html.replace('{phone}', fullName[0].phone)
        html = html.replace('{address}', fullName[0].address)
        res.write(html)
        //tra ve response
        res.end();
    }

}
module.exports = new Handle();
