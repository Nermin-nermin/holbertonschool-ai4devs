import java.util.Scanner;

// Simple login check: the user types a role, and admins get access.
class Bug3Fixed {
    static boolean isAdmin(String role) {
        // compare string CONTENT, and avoid NullPointerException if role is null
        return "admin".equals(role);
    }

    static int countAdmins(String[] roles) {
        int count = 0;
        for (int i = 0; i < roles.length; i++) {   // < not <=
            if (isAdmin(roles[i])) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        String typed = new Scanner("admin").nextLine();
        System.out.println(isAdmin(typed) ? "Access granted" : "Access denied");
        String[] team = {"admin", "dev", new String("admin")};
        System.out.println("Admins: " + countAdmins(team));
    }
}
