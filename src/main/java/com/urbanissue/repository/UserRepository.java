package com.urbanissue.repository;

import com.urbanissue.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByApprovalStatus(String approvalStatus);
    List<User> findByRoleAndApprovalStatus(String role, String approvalStatus);
}
