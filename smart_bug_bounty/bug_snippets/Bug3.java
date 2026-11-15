import java.util.Scanner;

// Simple login check: the user types a role, and admins get access.
// Expected: typing "admin" prints "Access granted".
public class Bug3 {
    static boolean isAdmin(String role) {
        return role == "admin";
    }

    static int countAdmins(String[] roles) {
        int count = 0;
        for (int i = 0; i <= roles.length; i++) {
            if (isAdmin(roles[i])) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        String typed = new Scanner("admin").nextLine();   // simulates user input
        System.out.println(isAdmin(typed) ? "Access granted" : "Access denied");
        String[] team = {"admin", "dev", new String("admin")};
        System.out.println("Admins: " + countAdmins(team));  // expected 2
    }
}
