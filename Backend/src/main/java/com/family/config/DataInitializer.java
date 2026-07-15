package com.family.config;

import com.family.common.enums.RoleEnum;
import com.family.entity.User;
import com.family.entity.Profile;
import com.family.repository.UserRepository;
import com.family.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeAdmin();
        initializeProfiles();
    }

    private void initializeAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            log.info("Creating default admin account...");
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@family.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setFullName("System Admin");
            admin.setRole(RoleEnum.ROLE_SYSTEM_ADMIN);
            admin.setEnabled(true);
            admin.setLocked(false);
            admin.setActive(true);
            admin.setDeleted(false);
            userRepository.save(admin);
            log.info("Default admin account created successfully!");
        } else {
            log.info("Admin account already exists. Skipping default admin creation.");
        }
    }

    private void initializeProfiles() {
        if (profileRepository.count() == 0) {
            log.info("Initializing 10 generations of family profiles (57 members)...");
            
            // Gen 1
            Profile g1H = createProfile("Nguyễn Văn Tổ", "M", LocalDate.of(1775, 4, 15), LocalDate.of(1845, 11, 20), 1, null, null, null);
            Profile g1W = createProfile("Trần Thị Tổ", "F", LocalDate.of(1778, 8, 10), LocalDate.of(1850, 5, 12), 1, null, null, null);
            g1H.setSpouseId(g1W.getId());
            g1W.setSpouseId(g1H.getId());
            profileRepository.save(g1H);
            profileRepository.save(g1W);

            // Gen 2
            Profile g2Son1 = createProfile("Nguyễn Văn Chiêu", "M", LocalDate.of(1802, 1, 5), LocalDate.of(1872, 9, 14), 2, g1H.getId(), g1W.getId(), null);
            Profile g2Spouse1 = createProfile("Lê Thị Hồng", "F", LocalDate.of(1805, 3, 22), LocalDate.of(1880, 12, 1), 2, null, null, null);
            g2Son1.setSpouseId(g2Spouse1.getId());
            g2Spouse1.setSpouseId(g2Son1.getId());
            profileRepository.save(g2Son1);
            profileRepository.save(g2Spouse1);

            Profile g2Son2 = createProfile("Nguyễn Văn Khang", "M", LocalDate.of(1804, 5, 12), LocalDate.of(1875, 11, 2), 2, g1H.getId(), g1W.getId(), null);
            Profile g2Spouse2 = createProfile("Vũ Thị Tuyết", "F", LocalDate.of(1808, 9, 19), LocalDate.of(1885, 4, 20), 2, null, null, null);
            g2Son2.setSpouseId(g2Spouse2.getId());
            g2Spouse2.setSpouseId(g2Son2.getId());
            profileRepository.save(g2Son2);
            profileRepository.save(g2Spouse2);

            Profile g2Dau = createProfile("Nguyễn Thị Mai", "F", LocalDate.of(1807, 6, 18), LocalDate.of(1865, 2, 28), 2, g1H.getId(), g1W.getId(), null);
            Profile g2DauSpouse = createProfile("Phạm Văn Hùng", "M", LocalDate.of(1805, 2, 14), LocalDate.of(1862, 8, 12), 2, null, null, null);
            g2Dau.setSpouseId(g2DauSpouse.getId());
            g2DauSpouse.setSpouseId(g2Dau.getId());
            profileRepository.save(g2Dau);
            profileRepository.save(g2DauSpouse);

            // Gen 3
            // From Chiêu & Hồng
            Profile g3Son1_1 = createProfile("Nguyễn Văn Đạo", "M", LocalDate.of(1830, 2, 2), LocalDate.of(1900, 8, 19), 3, g2Son1.getId(), g2Spouse1.getId(), null);
            Profile g3Spouse1_1 = createProfile("Phạm Thị Mơ", "F", LocalDate.of(1833, 7, 12), LocalDate.of(1905, 4, 3), 3, null, null, null);
            g3Son1_1.setSpouseId(g3Spouse1_1.getId());
            g3Spouse1_1.setSpouseId(g3Son1_1.getId());
            profileRepository.save(g3Son1_1);
            profileRepository.save(g3Spouse1_1);

            Profile g3Son1_2 = createProfile("Nguyễn Văn Hoà", "M", LocalDate.of(1832, 10, 10), LocalDate.of(1902, 1, 15), 3, g2Son1.getId(), g2Spouse1.getId(), null);
            Profile g3Spouse1_2 = createProfile("Bùi Thị Cúc", "F", LocalDate.of(1836, 12, 1), LocalDate.of(1908, 11, 20), 3, null, null, null);
            g3Son1_2.setSpouseId(g3Spouse1_2.getId());
            g3Spouse1_2.setSpouseId(g3Son1_2.getId());
            profileRepository.save(g3Son1_2);
            profileRepository.save(g3Spouse1_2);

            createProfile("Nguyễn Thị Lan", "F", LocalDate.of(1835, 11, 30), LocalDate.of(1895, 7, 24), 3, g2Son1.getId(), g2Spouse1.getId(), null);

            // From Khang & Tuyết
            Profile g3Son2_1 = createProfile("Nguyễn Văn Hùng", "M", LocalDate.of(1834, 4, 25), LocalDate.of(1904, 3, 10), 3, g2Son2.getId(), g2Spouse2.getId(), null);
            Profile g3Spouse2_1 = createProfile("Đỗ Thị Hương", "F", LocalDate.of(1837, 8, 14), LocalDate.of(1909, 12, 28), 3, null, null, null);
            g3Son2_1.setSpouseId(g3Spouse2_1.getId());
            g3Spouse2_1.setSpouseId(g3Son2_1.getId());
            profileRepository.save(g3Son2_1);
            profileRepository.save(g3Spouse2_1);

            // From Mai & Hùng
            createProfile("Phạm Văn Lâm", "M", LocalDate.of(1832, 3, 1), LocalDate.of(1898, 9, 15), 3, g2DauSpouse.getId(), g2Dau.getId(), null);

            // Gen 4
            // From Đạo & Mơ
            Profile g4Son1 = createProfile("Nguyễn Văn Hải", "M", LocalDate.of(1858, 5, 25), LocalDate.of(1928, 1, 10), 4, g3Son1_1.getId(), g3Spouse1_1.getId(), null);
            Profile g4Spouse1 = createProfile("Hoàng Thị Cúc", "F", LocalDate.of(1861, 9, 14), LocalDate.of(1935, 6, 22), 4, null, null, null);
            g4Son1.setSpouseId(g4Spouse1.getId());
            g4Spouse1.setSpouseId(g4Son1.getId());
            profileRepository.save(g4Son1);
            profileRepository.save(g4Spouse1);

            Profile g4Son2 = createProfile("Nguyễn Văn Giang", "M", LocalDate.of(1860, 10, 1), LocalDate.of(1932, 12, 15), 4, g3Son1_1.getId(), g3Spouse1_1.getId(), null);
            Profile g4Spouse2 = createProfile("Vũ Thị Đào", "F", LocalDate.of(1865, 2, 2), LocalDate.of(1940, 8, 9), 4, null, null, null);
            g4Son2.setSpouseId(g4Spouse2.getId());
            g4Spouse2.setSpouseId(g4Son2.getId());
            profileRepository.save(g4Son2);
            profileRepository.save(g4Spouse2);

            // From Hoà & Cúc
            Profile g4Son3 = createProfile("Nguyễn Văn Sơn", "M", LocalDate.of(1862, 7, 7), LocalDate.of(1935, 3, 20), 4, g3Son1_2.getId(), g3Spouse1_2.getId(), null);
            Profile g4Spouse3 = createProfile("Phan Thị Hoa", "F", LocalDate.of(1866, 11, 15), LocalDate.of(1942, 9, 2), 4, null, null, null);
            g4Son3.setSpouseId(g4Spouse3.getId());
            g4Spouse3.setSpouseId(g4Son3.getId());
            profileRepository.save(g4Son3);
            profileRepository.save(g4Spouse3);

            createProfile("Nguyễn Thị Liên", "F", LocalDate.of(1865, 4, 10), LocalDate.of(1920, 12, 1), 4, g3Son1_2.getId(), g3Spouse1_2.getId(), null);

            // From Hùng & Hương
            Profile g4Son4 = createProfile("Nguyễn Văn Nam", "M", LocalDate.of(1864, 8, 12), LocalDate.of(1938, 5, 18), 4, g3Son2_1.getId(), g3Spouse2_1.getId(), null);
            Profile g4Spouse4 = createProfile("Trịnh Thị Quỳnh", "F", LocalDate.of(1868, 11, 28), LocalDate.of(1945, 1, 30), 4, null, null, null);
            g4Son4.setSpouseId(g4Spouse4.getId());
            g4Spouse4.setSpouseId(g4Son4.getId());
            profileRepository.save(g4Son4);
            profileRepository.save(g4Spouse4);

            // Gen 5
            // From Hải & Cúc
            Profile g5Son1 = createProfile("Nguyễn Văn Hùng", "M", LocalDate.of(1885, 3, 12), LocalDate.of(1955, 9, 30), 5, g4Son1.getId(), g4Spouse1.getId(), null);
            Profile g5Spouse1 = createProfile("Võ Thị Mận", "F", LocalDate.of(1888, 8, 20), LocalDate.of(1960, 4, 15), 5, null, null, null);
            g5Son1.setSpouseId(g5Spouse1.getId());
            g5Spouse1.setSpouseId(g5Son1.getId());
            profileRepository.save(g5Son1);
            profileRepository.save(g5Spouse1);

            createProfile("Nguyễn Thị Huệ", "F", LocalDate.of(1887, 7, 7), LocalDate.of(1965, 11, 22), 5, g4Son1.getId(), g4Spouse1.getId(), null);

            // From Giang & Đào
            Profile g5Son2 = createProfile("Nguyễn Văn Long", "M", LocalDate.of(1888, 1, 1), LocalDate.of(1960, 5, 20), 5, g4Son2.getId(), g4Spouse2.getId(), null);
            Profile g5Spouse2 = createProfile("Trần Thị Thảo", "F", LocalDate.of(1892, 5, 10), LocalDate.of(1968, 9, 14), 5, null, null, null);
            g5Son2.setSpouseId(g5Spouse2.getId());
            g5Spouse2.setSpouseId(g5Son2.getId());
            profileRepository.save(g5Son2);
            profileRepository.save(g5Spouse2);

            // From Sơn & Hoa
            Profile g5Son3 = createProfile("Nguyễn Văn Việt", "M", LocalDate.of(1890, 6, 15), LocalDate.of(1965, 12, 10), 5, g4Son3.getId(), g4Spouse3.getId(), null);
            Profile g5Spouse3 = createProfile("Lê Thị Thư", "F", LocalDate.of(1894, 9, 20), LocalDate.of(1972, 8, 22), 5, null, null, null);
            g5Son3.setSpouseId(g5Spouse3.getId());
            g5Spouse3.setSpouseId(g5Son3.getId());
            profileRepository.save(g5Son3);
            profileRepository.save(g5Spouse3);

            // Gen 6
            // From Hùng & Mận
            Profile g6Son1 = createProfile("Nguyễn Văn Tuấn", "M", LocalDate.of(1912, 6, 20), LocalDate.of(1982, 3, 14), 6, g5Son1.getId(), g5Spouse1.getId(), null);
            Profile g6Spouse1 = createProfile("Phan Thị Liễu", "F", LocalDate.of(1915, 10, 5), LocalDate.of(1990, 8, 1), 6, null, null, null);
            g6Son1.setSpouseId(g6Spouse1.getId());
            g6Spouse1.setSpouseId(g6Son1.getId());
            profileRepository.save(g6Son1);
            profileRepository.save(g6Spouse1);

            Profile g6Son2 = createProfile("Nguyễn Văn Tùng", "M", LocalDate.of(1915, 4, 15), LocalDate.of(1988, 10, 20), 6, g5Son1.getId(), g5Spouse1.getId(), null);
            Profile g6Spouse2 = createProfile("Nguyễn Thị Thắm", "F", LocalDate.of(1918, 9, 30), LocalDate.of(1995, 5, 12), 6, null, null, null);
            g6Son2.setSpouseId(g6Spouse2.getId());
            g6Spouse2.setSpouseId(g6Son2.getId());
            profileRepository.save(g6Son2);
            profileRepository.save(g6Spouse2);

            // From Long & Thảo
            Profile g6Son3 = createProfile("Nguyễn Văn Dũng", "M", LocalDate.of(1918, 12, 12), LocalDate.of(1993, 1, 5), 6, g5Son2.getId(), g5Spouse2.getId(), null);
            Profile g6Spouse3 = createProfile("Vũ Thị Hà", "F", LocalDate.of(1922, 3, 18), LocalDate.of(2001, 7, 24), 6, null, null, null);
            g6Son3.setSpouseId(g6Spouse3.getId());
            g6Spouse3.setSpouseId(g6Son3.getId());
            profileRepository.save(g6Son3);
            profileRepository.save(g6Spouse3);

            // Gen 7
            // From Tuấn & Liễu
            Profile g7Son1 = createProfile("Nguyễn Văn Minh", "M", LocalDate.of(1938, 9, 28), LocalDate.of(2008, 5, 19), 7, g6Son1.getId(), g6Spouse1.getId(), null);
            Profile g7Spouse1 = createProfile("Vương Thị Nga", "F", LocalDate.of(1941, 12, 10), LocalDate.of(2015, 2, 28), 7, null, null, null);
            g7Son1.setSpouseId(g7Spouse1.getId());
            g7Spouse1.setSpouseId(g7Son1.getId());
            profileRepository.save(g7Son1);
            profileRepository.save(g7Spouse1);

            createProfile("Nguyễn Thị Xuân", "F", LocalDate.of(1940, 1, 15), null, 7, g6Son1.getId(), g6Spouse1.getId(), null);

            // From Tùng & Thắm
            Profile g7Son2 = createProfile("Nguyễn Văn Quân", "M", LocalDate.of(1942, 8, 14), LocalDate.of(2012, 10, 5), 7, g6Son2.getId(), g6Spouse2.getId(), null);
            Profile g7Spouse2 = createProfile("Tạ Thị Ngọc", "F", LocalDate.of(1945, 11, 20), LocalDate.of(2020, 4, 18), 7, null, null, null);
            g7Son2.setSpouseId(g7Spouse2.getId());
            g7Spouse2.setSpouseId(g7Son2.getId());
            profileRepository.save(g7Son2);
            profileRepository.save(g7Spouse2);

            // Gen 8
            // From Minh & Nga
            Profile g8Son1 = createProfile("Nguyễn Văn Bình", "M", LocalDate.of(1965, 12, 5), null, 8, g7Son1.getId(), g7Spouse1.getId(), null);
            Profile g8Spouse1 = createProfile("Đặng Thị Phương", "F", LocalDate.of(1968, 5, 20), null, 8, null, null, null);
            g8Son1.setSpouseId(g8Spouse1.getId());
            g8Spouse1.setSpouseId(g8Son1.getId());
            profileRepository.save(g8Son1);
            profileRepository.save(g8Spouse1);

            createProfile("Nguyễn Thị Hoa", "F", LocalDate.of(1968, 3, 15), null, 8, g7Son1.getId(), g7Spouse1.getId(), null);

            // From Quân & Ngọc
            Profile g8Son2 = createProfile("Nguyễn Văn Tiến", "M", LocalDate.of(1970, 7, 7), null, 8, g7Son2.getId(), g7Spouse2.getId(), null);
            Profile g8Spouse2 = createProfile("Lê Thị Kim", "F", LocalDate.of(1973, 10, 10), null, 8, null, null, null);
            g8Son2.setSpouseId(g8Spouse2.getId());
            g8Spouse2.setSpouseId(g8Son2.getId());
            profileRepository.save(g8Son2);
            profileRepository.save(g8Spouse2);

            // Gen 9
            // From Bình & Phương
            Profile g9Son1 = createProfile("Nguyễn Văn Khánh", "M", LocalDate.of(1990, 8, 14), null, 9, g8Son1.getId(), g8Spouse1.getId(), null);
            Profile g9Spouse1 = createProfile("Bùi Thị Quỳnh", "F", LocalDate.of(1993, 2, 25), null, 9, null, null, null);
            g9Son1.setSpouseId(g9Spouse1.getId());
            g9Spouse1.setSpouseId(g9Son1.getId());
            profileRepository.save(g9Son1);
            profileRepository.save(g9Spouse1);

            createProfile("Nguyễn Văn Nam", "M", LocalDate.of(1993, 11, 30), null, 9, g8Son1.getId(), g8Spouse1.getId(), null);

            // From Tiến & Kim
            Profile g9Son2 = createProfile("Nguyễn Văn Cường", "M", LocalDate.of(1995, 5, 20), null, 9, g8Son2.getId(), g8Spouse2.getId(), null);
            Profile g9Spouse2 = createProfile("Đỗ Thị Mỹ", "F", LocalDate.of(1998, 9, 15), null, 9, null, null, null);
            g9Son2.setSpouseId(g9Spouse2.getId());
            g9Spouse2.setSpouseId(g9Son2.getId());
            profileRepository.save(g9Son2);
            profileRepository.save(g9Spouse2);

            // Gen 10
            // From Khánh & Quỳnh
            createProfile("Nguyễn Văn Phong", "M", LocalDate.of(2018, 10, 12), null, 10, g9Son1.getId(), g9Spouse1.getId(), null);
            createProfile("Nguyễn Thị Trúc", "F", LocalDate.of(2021, 6, 8), null, 10, g9Son1.getId(), g9Spouse1.getId(), null);

            // From Cường & Mỹ
            createProfile("Nguyễn Văn Đạt", "M", LocalDate.of(2020, 1, 15), null, 10, g9Son2.getId(), g9Spouse2.getId(), null);
            createProfile("Nguyễn Thị Ngọc", "F", LocalDate.of(2022, 11, 5), null, 10, g9Son2.getId(), g9Spouse2.getId(), null);

            log.info("Family profiles initialized successfully!");
        } else {
            log.info("Profiles already exist. Skipping default family profile initialization.");
        }
    }

    private Profile createProfile(String fullName, String gender, LocalDate birthDate, LocalDate deathDate, Integer generation, UUID fatherId, UUID motherId, UUID spouseId) {
        Profile p = new Profile();
        p.setFullName(fullName);
        p.setGender(gender);
        p.setBirthDate(birthDate);
        p.setDeathDate(deathDate);
        p.setGeneration(generation);
        p.setFatherId(fatherId);
        p.setMotherId(motherId);
        if (fatherId != null) {
            p.setParentId(fatherId);
        } else if (motherId != null) {
            p.setParentId(motherId);
        }
        p.setSpouseId(spouseId);
        p.setActive(true);
        p.setDeleted(false);
        return profileRepository.save(p);
    }
}
