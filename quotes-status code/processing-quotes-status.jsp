<%@ page import="java.sql.*, java.util.*" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="project.ConnectionProvider" %>

<%
                                // Database connection parameters
                                String jdbcURL = "jdbc:mysql://localhost:3306/jetBlueTransport";
                                String dbUser = "root"; // Replace with your database username
                                String dbPassword = "SAVAGEGOD20:)"; // Replace with your database password
                                 
                                try {
                                    // Load JDBC driver
                                    Class.forName("com.mysql.cj.jdbc.Driver");
                                    
                                    // Establish connection
                                  Connection con = DriverManager.getConnection(jdbcURL, dbUser, dbPassword);
                                    
                                    // Query for approved quotes
                                    String approvedQuery = "SELECT * FROM quotes WHERE status = 'approved'";
                                    Statement stmt = con.createStatement();
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
                                    con.close();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            %>
                            
                            
                            
                            
                                try {
                                    // Create new connection
                                    Connection conn = DriverManager.getConnection(url, username, password);
                                    
                                    // Query for rejected quotes
                                    String rejectedQuery = "SELECT * FROM quotes WHERE status = 'rejected'";
                                    Statement stmt = conn.createStatement();
                                    ResultSet rejectedResults = stmt.executeQuery(rejectedQuery);
                                    
                                    // Display rejected quotes
                                    while (rejectedResults.next()) {
                                        String customerName = rejectedResults.getString("customer_name");
                                        String email = rejectedResults.getString("email");
                                        String serviceType = rejectedResults.getString("service_type");
                                        String addFrom = rs.getString("addFrom");
                                        String addTo = rs.getString("addTo");
                                        String items = rejectedResults.getString("items");
                            %>
                            
                                    }
                                    
                                    // Close resources
                                    rejectedResults.close();
                                    stmt.close();
                                    conn.close();
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                            %>