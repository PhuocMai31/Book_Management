const http = require('http');
const url = require('url');
const Handler = require('./handles/Handle')
const qs = require("qs");
let formidable = require('formidable');
const fs = require("fs");

let users = [];
const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    const methodRequest = req.method;

    // xu ly router
    switch (pathName) {
        case '/':
            Handler.showHome(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/showNamiya':
            Handler.showNamiya(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/showThePrince':
            Handler.showThePrince(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/showSapien':
            Handler.showSapien(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/about':
            Handler.about(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin':
            Handler.showDashboard(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin/users':
            // kiem tra session
            // lay  thong tin session tu cookie cua request
            let cookie = req.headers.cookie;
            let usernameLogin = qs.parse(cookie).u_user;
            if (!usernameLogin) {
                res.writeHead(301, {Location: '/admin/login'})
                return res.end();
            }

            Handler.showListUsers(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/admin/users/delete':
            Handler.deleteUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/delete':
            Handler.deleteBoook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/create':
            Handler.showFormCreateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/store':
            Handler.storeUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/update':
            Handler.showFormUpdateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/users/edit':
            Handler.updateUser(req, res).catch(err => {
                console.log(err.message)
            })
            break
        case '/admin/login':
            if (methodRequest == 'GET') {
                Handler.showFormLogin(req, res).catch(err => {
                    console.log(err.message)
                })
            }
            else {
                Handler.login(req, res).catch(err => {
                    console.log(err.message)
                })
            }
            break;
        case '/changePass':
            Handler.showFormChangePass(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/changePass/success':
            Handler.changePass(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/register':
            Handler.showFormRegister(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/register/success':
            Handler.createUser(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/create':
            Handler.showFormCreateBook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/store':
            Handler.storeBook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/update':
            Handler.showFormUpdateBook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/admin/boook/edit':
            Handler.updateBook(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/uploadimage':
            fs.readFile('./views/register.html', function (err, data) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                return res.end();
            });
            break;
        case '/upload':
            // Khởi tạo biến form bằng IncomingForm để phân tích một tập tin tải lên
            let form = new formidable.IncomingForm();
            // Cấu hình thư mục sẽ chứa file trên server với hàm .uploadDir
            form.uploadDir = "upload/"
            // Xử lý upload file với hàm .parse
            form.parse(req, function (err, fields, files) {
                // Tạo đối tượng user
                let userInfo = {
                    // name: fields.name,
                    // email: fields.email,
                    // password: fields.password,
                };

                if (err) {
                    // Kiểm tra nếu có lỗi
                    console.error(err.message);
                    return res.end(err.message);
                }
                // Lấy ra đường dẫn tạm của tệp tin trên server
                let tmpPath = files.avatar.filepath;
                // Khởi tạo đường dẫn mới, mục đích để lưu file vào thư mục uploads của chúng ta
                let newPath = form.uploadDir + files.avatar.originalFilename;
                // Tạo thuộc tính avatar và gán giá trị cho nó
                userInfo.avatar = newPath;
                // Đổi tên của file tạm thành tên mới và lưu lại
                fs.rename(tmpPath, newPath, (err) => {
                    if (err) throw err;
                    let fileType = files.avatar.mimeType;
                    let mimeTypes = ["image/jpeg", "image/jpg", "image/png"];
                    if (mimeTypes.indexOf(fileType) === -1) {
                        res.writeHead(200, {"Content-Type": "text/html"});
                        return res.end('The file is not in the correct format: png, jpeg, jpg');
                    }
                });
                users.push(userInfo);
                console.log(users)
                res.end('Register success!');
            });
            break;
        case '/locao':
            Handler.logout(req,res).catch(err => {
                console.log(err.message)
            });

            break;
        case '/showBookList':
            Handler.showBookList(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/Boook/lichsu':
            Handler.showBookLichsu(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/Boook/triethoc':
            Handler.showBookTrietHoc(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/Boook/giaoduc':
            Handler.showBookgiaoduc(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/Boook/truyen':
            Handler.showBooktruyen(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/sxceads':
            Handler.showBooksearch(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/order':
            Handler.order(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/userorder':
            Handler.showorder(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/deleteItemOrderList':
            Handler.deleteItemOderList(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/insertOderToDataBase':
            Handler.inserOrderToDatabase(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        case '/viewOrder':
            Handler.viewOrder(req, res).catch(err => {
                console.log(err.message)
            });
            break;
        default:
            res.end();
    }
})

server.listen(8001, 'localhost', () => {
    console.log('server listening on port' + 8001)
})
// `<img src="upload/${}">`
