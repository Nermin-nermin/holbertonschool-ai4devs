// Plain-Java test runner (no JUnit dependency). Run: javac -d out Bug3Fixed.java tests/Bug3FixedTest.java && java -cp out Bug3FixedTest
public class Bug3FixedTest {
    static int passed = 0, failed = 0;
    static void check(String name, boolean ok) {
        if (ok) { passed++; System.out.println("PASS " + name); }
        else { failed++; System.out.println("FAIL " + name); }
    }
    public static void main(String[] args) {
        check("typed input 'admin' is admin", Bug3Fixed.isAdmin(new java.util.Scanner("admin").nextLine()));
        check("new String(\"admin\") is admin", Bug3Fixed.isAdmin(new String("admin")));
        check("'dev' is not admin", !Bug3Fixed.isAdmin("dev"));
        check("null is not admin (no NPE)", !Bug3Fixed.isAdmin(null));
        check("counts 2 admins without exception", Bug3Fixed.countAdmins(new String[]{"admin", "dev", new String("admin")}) == 2);
        check("empty array -> 0", Bug3Fixed.countAdmins(new String[]{}) == 0);
        System.out.println(passed + " passed, " + failed + " failed");
        if (failed > 0) System.exit(1);
    }
}
