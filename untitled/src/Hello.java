import java.sql.*;

public class Hello {

    private static final String url = "jdbc:mysql://localhost:3306/testjdbc";
    private static final String username = "root";
    private static final String password = "Admin2123";

    public static void main(String[] args) {
        try {
            // Load JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            // Create connection
            Connection connection = DriverManager.getConnection(url, username, password);

            String query="SELECT age FROM students WHERE id=?";
            PreparedStatement preparedStatement  = connection.prepareStatement(query);

            // Using String.format to build SQL query (Not recommended for production)
            preparedStatement.setInt(1,4);
            ResultSet resultSet=preparedStatement.executeQuery();

            if (resultSet.next()) {
                System.out.println("Age"+ resultSet.getInt("age"));
            } else {
                System.out.println("updated failed (No rows affected)");
            }

            // Close connection
            connection.close();

        } catch (ClassNotFoundException e) {
            System.out.println("Driver not found: " + e.getMessage());
        } catch (SQLException e) {
            System.out.println("SQL Error: " + e.getMessage());
        }
    }
}
