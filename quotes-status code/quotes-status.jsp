<%@ page import="java.sql.*, java.util.*" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Quotes Status | JetBlue Transport</title>
    <link rel="stylesheet" href="quotes-status.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <div class="dashboard-container">
        <!-- Mobile menu toggle button -->
        <button class="mobile-menu-toggle" id="mobileMenuToggle">
            <span class="material-icons">menu</span>
        </button>
        
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="logo-container">
                    <img src="images/Jet_Blue_LOGO.png" alt="JetBlue Transport Logo" class="logo">
                    <span class="company-name">JetBlue Transport</span>
                </div>
                <!-- Close button for mobile -->
                <button class="close-sidebar" id="closeSidebar">
                    <span class="material-icons">close</span>
                </button>
            </div>
            
            <nav class="nav-menu">
                <a href="appointments.jsp" class="nav-button">Appointments</a>
                <a href="users.jsp" class="nav-button">Users</a>
                <a href="current-jobs.jsp" class="nav-button">Current Jobs</a>
                <a href="past-jobs.jsp" class="nav-button">Past Jobs</a>
                <a href="quotes.jsp" class="nav-button">Quotes</a>
            </nav>
        </aside>

        <main class="main-content">
            <header class="top-header">
                <h1>Quotes Status</h1>
                <button class="logout-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="logout-text">Log Out</span>
                </button>
            </header>

            <!-- Search bar -->
            <div class="search-bar-search">
                <input type="text" id="searchInput" placeholder="Type to search...">
                <svg xmlns="http://www.w3.org/2000/svg" class="search-icon-search" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
            </div>

            <div class="content-wrapper">
                <!-- Tab list -->
                <div class="tab-list-container">
                    <div class="tab-list">
                        <button class="tab-button active" data-tab="approved">Approved</button>
                        <button class="tab-button" data-tab="rejected">Rejected</button>
                    </div>
                </div>

                <!-- Tab content -->
                <div class="tab-content">
                    <div class="tab-pane active" id="approved-tab">
                        <!-- Approved tab content -->
                        <div class="quotes-list" id="quotesList">
                            <%
                                // Database connection parameters
                                String jdbcURL = "jdbc:mysql://localhost:3306/jetBlueTransport";
                                String dbUser = "root"; // Replace with your database username
                                String dbPassword = "SAVAGEGOD20:)"; // Replace with your database password
                                Connection conn = null; 
                                try {
                                    // Load JDBC driver
                                    Class.forName("com.mysql.cj.jdbc.Driver");
                                    
                                    // Establish connection
                                   conn = DriverManager.getConnection(jdbcURL, dbUser, dbPassword);
                                    
                                    // Query for approved quotes
                                    // Query for approved quotes with JOIN to get customer name
                                    String approvedQuery = "SELECT q.*, c.name AS customer_name " +
                                    "FROM quotes q " +
                                    "JOIN customers c ON q.id = c.id " +
                                    "WHERE q.status = 'approved'";
                                    Statement stmt = conn.createStatement();
                                    ResultSet approvedResults = stmt.executeQuery(approvedQuery);
                                    
                                    // Display approved quotes
                                    while (approvedResults.next()) {
                                        String customerName = approvedResults.getString("customer_name");
                                        String email = approvedResults.getString("email");
                                        String serviceType = approvedResults.getString("service_type");
                                        String addFrom = approvedResults.getString("addFrom");
                                        String addTo = approvedResults.getString("addTo");
                                        String items = approvedResults.getString("items");
                            %>
                            <div class="quote-card">
                                <h2><%= customerName %></h2>
                                <p class="email"><%= email %></p>
                                <p class="service-type"><%= serviceType %></p>
                                <p class="route"><%= addFrom %> to <%= addTo %></p>
                                <p class="items"><%= items %></p>
                            </div>
                            <%
                                    }
                                    
                                    // Close resources
                                    approvedResults.close();
                                    stmt.close();
                                    conn.close();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            %>
                        </div>
                    </div>
                    <div class="tab-pane" id="rejected-tab">
                        <!-- Rejected tab content -->
                        <div class="quotes-list">
                            <%
                                try {
                                    // Create new connection
                                   	conn = DriverManager.getConnection(jdbcURL, dbUser, dbPassword);
                                    
                                    // Query for rejected quotes
                                    String rejectedQuery = "SELECT q.*, c.name AS customer_name " +
                                    "FROM quotes q " +
                                    "JOIN customers c ON q.id = c.id " +
                                    "WHERE q.status = 'rejected'";
                                    Statement stmt = conn.createStatement();
                                    ResultSet rejectedResults = stmt.executeQuery(rejectedQuery);
                                    
                                    // Display rejected quotes
                                    while (rejectedResults.next()) {
                                        String customerName = rejectedResults.getString("customer_name");
                                        String email = rejectedResults.getString("email");
                                        String serviceType = rejectedResults.getString("service_type");
                                        String addFrom = rejectedResults.getString("addFrom");
                                        String addTo = rejectedResults.getString("addTo");
                                        String items = rejectedResults.getString("items");
                            %>
                            <div class="quote-card">
                                <h2><%= customerName %></h2>
                                <p class="email"><%= email %></p>
                                <p class="service-type"><%= serviceType %></p>
                                <p class="route"><%= addFrom %> to <%= addTo %></p>
                                <p class="items"><%= items %></p>
                            </div>
                            <%
                                    }
                                    
                                    // Close resources
                                    rejectedResults.close();
                                    stmt.close();
                                    conn.close();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            %>
                        </div>
                    </div>
                </div>
                
                <!-- No results message -->
                <div class="no-results" id="noResults">
                    <span class="material-icons">search_off</span>
                    <p>No quotes found</p>
                </div>
                
                <!-- Pagination -->
                <div class="pagination" id="pagination">
                    <button class="pagination-btn" id="prevBtn"><i class="material-icons">chevron_left</i></button>
                    <div class="page-numbers">
                        <button class="pagination-btn active">1</button>
                        <button class="pagination-btn">2</button>
                        <button class="pagination-btn">3</button>
                        <button class="pagination-btn">4</button>
                        <span class="ellipsis">...</span>
                        <button class="pagination-btn">9</button>
                    </div>
                    <button class="pagination-btn" id="nextBtn"><i class="material-icons">chevron_right</i></button>
                </div>
            </div>
        </main>
        
        <!-- Overlay for mobile sidebar -->
        <div class="overlay" id="overlay"></div>
    </div>
    <script src="quotes-status.js"></script>
</body>
</html>