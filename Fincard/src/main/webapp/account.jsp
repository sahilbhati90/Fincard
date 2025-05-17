<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!--Website: wwww.codingdung.com-->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fincardaccount</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    }

    body {
      background-color: #f0f0f0;
    }

    /* Navbar */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 20px;
      background-color: rgba(15, 65, 167, 0.918);
      box-shadow: 0 4px 6px rgba(1, 6, 12, 0.981);
      color: white;
      position: relative;
      z-index: 1000;
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      gap: 5px;
      padding: 10px;
      background-color: rgb(0, 0, 0);
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }

    .hamburger span {
      width: 25px;
      height: 3px;
      background: rgb(255, 255, 255);
      transition: all 0.3s ease;
    }

    .logo {
      height: 60px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    
    /* Nav Menu */
    .nav-menu {
      position: fixed;
      top: 0;
      left: -100%;
      height: 100vh;
      width: 240px;
      background-color: #040404;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(1, 6, 12, 0.981);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between; /* Space between menu items and footer */
      padding-top: 5rem;
      transition: left 0.3s ease;
    }

    .nav-menu.active {
      left: 0;
    }

    .nav-menu ul {
      list-style: none;
      padding: 15px;
    }

    .nav-menu li {
      margin: 30px 0;
    }

    .nav-menu li a {
      text-decoration: none;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      padding: 10px 20px;
      background-color: #1a1a1a;
      border: 2px solid transparent;
      border-radius: 5px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .nav-menu li a i {
      margin-right: 10px;
    }

    .nav-menu li a:hover {
      background-color: #00bfff;
      border-color: #00bfff;
      color: white;
    }

    /* Footer in Nav Menu */
    .nav-footer {
      width: 100%;
      padding: 10px;
      background-color: #1a1a1a91;
      color: white;
      text-align: center;
      font-size: 0.9rem;
      border-top: 1px solid #33333300;
    }

    /* Animate Hamburger */
    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
    .ui-w-80 {
    width : 80px !important;
    height: auto;
}

.btn-default {
    border-color: rgba(24, 28, 33, 0.1);
    background  : rgba(0, 0, 0, 0);
    color       : #4E5155;
}

label.btn {
    margin-bottom: 0;
}

.btn-outline-primary {
    border-color: #26B4FF;
    background  : transparent;
    color       : #26B4FF;
}

.btn {
    cursor: pointer;
}

.text-light {
    color: #babbbc !important;
}

.btn-facebook {
    border-color: rgba(0, 0, 0, 0);
    background  : #3B5998;
    color       : #fff;
}

.btn-instagram {
    border-color: rgba(0, 0, 0, 0);
    background  : #000;
    color       : #fff;
}

.card {
    background-clip: padding-box;
    box-shadow     : 0 1px 4px rgba(24, 28, 33, 0.012);
}

.row-bordered {
    overflow: hidden;
}

.account-settings-fileinput {
    position  : absolute;
    visibility: hidden;
    width     : 1px;
    height    : 1px;
    opacity   : 0;
}

.account-settings-links .list-group-item.active {
    font-weight: bold !important;
}

html:not(.dark-style) .account-settings-links .list-group-item.active {
    background: transparent !important;
}

.account-settings-multiselect~.select2-container {
    width: 100% !important;
}

.light-style .account-settings-links .list-group-item {
    padding     : 0.85rem 1.5rem;
    border-color: rgba(24, 28, 33, 0.03) !important;
}

.light-style .account-settings-links .list-group-item.active {
    color: #4e5155 !important;
}

.material-style .account-settings-links .list-group-item {
    padding     : 0.85rem 1.5rem;
    border-color: rgba(24, 28, 33, 0.03) !important;
}

.material-style .account-settings-links .list-group-item.active {
    color: #4e5155 !important;
}

.dark-style .account-settings-links .list-group-item {
    padding     : 0.85rem 1.5rem;
    border-color: rgba(255, 255, 255, 0.03) !important;
}

.dark-style .account-settings-links .list-group-item.active {
    color: #fff !important;
}

.light-style .account-settings-links .list-group-item.active {
    color: #4E5155 !important;
}

.light-style .account-settings-links .list-group-item {
    padding     : 0.85rem 1.5rem;
    border-color: rgba(24, 28, 33, 0.03) !important;
}
        .container {
            margin-left: 300px; /* Adjust the value as needed */
        }
        .footer {
    background-color: #000;
    color: #fff;
    padding: 40px 20px;
    text-align: center;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

.footer-links {
    margin-bottom: 20px;
}

.footer-links a {
    color: #1e88e5;
    text-decoration: none;
    margin: 0 10px;
    font-size: 16px;
}

.footer-links a:hover {
    text-decoration: underline;
}

.footer p {
    font-size: 14px;
    color: #aaa;
    margin: 0;
}        
   
  </style>
</head>
<body>
  <div class="navbar">
      <div class="hamburger" id="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <img src="Images/Fin_Card-removebg-preview.png" alt="Logo" class="logo">
    </div>
  
    <div class="nav-menu" id="nav-menu">
      
      <ul>
          <li><a href="index.jsp"><i class="fas fa-home"></i>Home</a></li>
          <li><a href="account.jsp"><i class="fas fa-user"></i>Account</a></li>
          <li><a href="dashboard.html"><i class="fas fa-tv"></i>Dashboard</a></li>
          <li><a href="transaction.html"><i class="fas fa-bank"></i>Transaction</a></li>
          <li><a href="cards.html"><i class="fas fa-wallet"></i>Cards</a></li>
          <li><a href="loan.html"><i class="fas fa-dollar"></i>Loan Eligibility</a></li>
          <li><a href="index.jsp"><i class="fas fa-fire"></i>Logout</a></li>
      </ul>
      <div class="nav-footer">
        &copy; 2025 Fincard. All rights reserved.
      </div>
    </div>
  <div class="container light-style flex-grow-1 container-p-y">
      <h4 class="font-weight-bold py-3 mb-4">
          Account settings
      </h4>
      <div class="card overflow-hidden">
          <div class="row no-gutters row-bordered row-border-light">
              <div class="col-md-3 pt-0">
                  <div class="list-group list-group-flush account-settings-links">
                      <a class="list-group-item list-group-item-action active" data-toggle="list"
                          href="#account-general">General</a>
                      <a class="list-group-item list-group-item-action" data-toggle="list"
                          href="#account-change-password">Change password</a>
                      <a class="list-group-item list-group-item-action" data-toggle="list"
                          href="#account-info">Info</a>
                      <a class="list-group-item list-group-item-action" data-toggle="list"
                          href="#account-social-links">Social links</a>
                      <a class="list-group-item list-group-item-action" data-toggle="list"
                          href="#account-connections">Connections</a>
                      <a class="list-group-item list-group-item-action" data-toggle="list"
                          href="#account-notifications">Notifications</a>
                  </div>
              </div>
              <div class="col-md-9">
                  <div class="tab-content">
                      <div class="tab-pane fade active show" id="account-general">
                          <div class="card-body media align-items-center">
                              <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt
                                  class="d-block ui-w-80">
                              <div class="media-body ml-4">
                                  <label class="btn btn-outline-primary">
                                      Upload new photo
                                      <input type="file" class="account-settings-fileinput">
                                  </label> &nbsp;
                                  <button type="button" class="btn btn-default md-btn-flat">Reset</button>
                                  <div class="text-light small mt-1">Allowed JPG, GIF or PNG. Max size of 800K</div>
                              </div>
                          </div>
                          <hr class="border-light m-0">
                          <div class="card-body">
                              <div class="form-group">
                                  <label class="form-label">Username</label>
                                  <input type="text" class="form-control mb-1" value="nmaxwell">
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Name</label>
                                  <input type="text" class="form-control" value="Nelle Maxwell">
                              </div>
                              <div class="form-group">
                                  <label class="form-label">E-mail</label>
                                  <input type="text" class="form-control mb-1" value="nmaxwell@mail.com">
                                  <div class="alert alert-warning mt-3">
                                      Your email is not confirmed. Please check your inbox.<br>
                                      <a href="javascript:void(0)">Resend confirmation</a>
                                  </div>
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Company</label>
                                  <input type="text" class="form-control" value="Company Ltd.">
                              </div>
                          </div>
                      </div>
                      <div class="tab-pane fade" id="account-change-password">
                          <div class="card-body pb-2">
                              <div class="form-group">
                                  <label class="form-label">Current password</label>
                                  <input type="password" class="form-control">
                              </div>
                              <div class="form-group">
                                  <label class="form-label">New password</label>
                                  <input type="password" class="form-control">
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Repeat new password</label>
                                  <input type="password" class="form-control">
                              </div>
                          </div>
                      </div>
                      <div class="tab-pane fade" id="account-info">
                          <div class="card-body pb-2">
                              <div class="form-group">
                                  <label class="form-label">Bio</label>
                                  <textarea class="form-control"
                                      rows="5">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nunc arcu, dignissim sit amet sollicitudin iaculis, vehicula id urna. Sed luctus urna nunc. Donec fermentum, magna sit amet rutrum pretium, turpis dolor molestie diam, ut lacinia diam risus eleifend sapien. Curabitur ac nibh nulla. Maecenas nec augue placerat, viverra tellus non, pulvinar risus.</textarea>
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Birthday</label>
                                  <input type="text" class="form-control" value="May 3, 1995">
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Country</label>
                                  <select class="custom-select">
                                      <option>USA</option>
                                      <option selected>Canada</option>
                                      <option>UK</option>
                                      <option>Germany</option>
                                      <option>France</option>
                                  </select>
                              </div>
                          </div>
                          <hr class="border-light m-0">
                          <div class="card-body pb-2">
                              <h6 class="mb-4">Contacts</h6>
                              <div class="form-group">
                                  <label class="form-label">Phone</label>
                                  <input type="text" class="form-control" value="+0 (123) 456 7891">
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Website</label>
                                  <input type="text" class="form-control" value>
                              </div>
                          </div>
                      </div>
                      <div class="tab-pane fade" id="account-social-links">
                          <div class="card-body pb-2">
                              <div class="form-group">
                                  <label class="form-label">Twitter</label>
                                  <input type="text" class="form-control" value="https://twitter.com/user">
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Facebook</label>
                                  <input type="text" class="form-control" value="https://www.facebook.com/user">
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Google+</label>
                                  <input type="text" class="form-control" value>
                              </div>
                              <div class="form-group">
                                  <label class="form-label">LinkedIn</label>
                                  <input type="text" class="form-control" value>
                              </div>
                              <div class="form-group">
                                  <label class="form-label">Instagram</label>
                                  <input type="text" class="form-control" value="https://www.instagram.com/user">
                              </div>
                          </div>
                      </div>
                      <div class="tab-pane fade" id="account-connections">
                          <div class="card-body">
                              <button type="button" class="btn btn-twitter">Connect to
                                  <strong>Twitter</strong></button>
                          </div>
                          <hr class="border-light m-0">
                          <div class="card-body">
                              <h5 class="mb-2">
                                  <a href="javascript:void(0)" class="float-right text-muted text-tiny"><i
                                          class="ion ion-md-close"></i> Remove</a>
                                  <i class="ion ion-logo-google text-google"></i>
                                  You are connected to Google:
                              </h5>
                              <a href="/cdn-cgi/l/email-protection" class="__cf_email__"
                                  data-cfemail="f9979498818e9c9595b994989095d79a9694">[email&#160;protected]</a>
                          </div>
                          <hr class="border-light m-0">
                          <div class="card-body">
                              <button type="button" class="btn btn-facebook">Connect to
                                  <strong>Facebook</strong></button>
                          </div>
                          <hr class="border-light m-0">
                          <div class="card-body">
                              <button type="button" class="btn btn-instagram">Connect to
                                  <strong>Instagram</strong></button>
                          </div>
                      </div>
                      <div class="tab-pane fade" id="account-notifications">
                          <div class="card-body pb-2">
                              <h6 class="mb-4">Activity</h6>
                              <div class="form-group">
                                  <label class="switcher">
                                      <input type="checkbox" class="switcher-input" checked>
                                      <span class="switcher-indicator">
                                          <span class="switcher-yes"></span>
                                          <span class="switcher-no"></span>
                                      </span>
                                      <span class="switcher-label">Email me when someone comments on my article</span>
                                  </label>
                              </div>
                              <div class="form-group">
                                  <label class="switcher">
                                      <input type="checkbox" class="switcher-input" checked>
                                      <span class="switcher-indicator">
                                          <span class="switcher-yes"></span>
                                          <span class="switcher-no"></span>
                                      </span>
                                      <span class="switcher-label">Email me when someone answers on my forum
                                          thread</span>
                                  </label>
                              </div>
                              <div class="form-group">
                                  <label class="switcher">
                                      <input type="checkbox" class="switcher-input">
                                      <span class="switcher-indicator">
                                          <span class="switcher-yes"></span>
                                          <span class="switcher-no"></span>
                                      </span>
                                      <span class="switcher-label">Email me when someone follows me</span>
                                  </label>
                              </div>
                          </div>
                          <hr class="border-light m-0">
                          <div class="card-body pb-2">
                              <h6 class="mb-4">Application</h6>
                              <div class="form-group">
                                  <label class="switcher">
                                      <input type="checkbox" class="switcher-input" checked>
                                      <span class="switcher-indicator">
                                          <span class="switcher-yes"></span>
                                          <span class="switcher-no"></span>
                                      </span>
                                      <span class="switcher-label">News and announcements</span>
                                  </label>
                              </div>
                              <div class="form-group">
                                  <label class="switcher">
                                      <input type="checkbox" class="switcher-input">
                                      <span class="switcher-indicator">
                                          <span class="switcher-yes"></span>
                                          <span class="switcher-no"></span>
                                      </span>
                                      <span class="switcher-label">Weekly product updates</span>
                                  </label>
                              </div>
                              <div class="form-group">
                                  <label class="switcher">
                                      <input type="checkbox" class="switcher-input" checked>
                                      <span class="switcher-indicator">
                                          <span class="switcher-yes"></span>
                                          <span class="switcher-no"></span>
                                      </span>
                                      <span class="switcher-label">Weekly blog digest</span>
                                  </label>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div class="text-right mt-3">
          <button type="button" class="btn btn-primary">Save changes</button>&nbsp;
          <button type="button" class="btn btn-default">Cancel</button>
      </div>
  </div>
  <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Support</a>
        </div>
        <p>&copy; 2023 Fincard. All rights reserved.</p>
      </div>
    </footer>
  <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>
  <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/js/bootstrap.bundle.min.js"></script>
  <script type="text/javascript">
      // Select the hamburger and nav menu
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  // Add click event listener to toggle classes
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  </script>
</body>

</html>
</html>