package com.urbanissue.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import com.urbanissue.model.User;
import com.urbanissue.service.UserService;
import com.urbanissue.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private IssueService issueService;

    @GetMapping("/pending")
    public List<User> getPendingUsers() {
        return userService.getPendingUsers();
    }

    @PutMapping("/approve/{id}")
    public User approveUser(@PathVariable Long id) {
        return userService.approveUser(id);
    }

    @GetMapping("/workers")
    public List<User> getApprovedWorkers() {
        return userService.getApprovedWorkers();
    }

    @GetMapping("/stats")
    public Map<String, Long> getIssueStats() {
        return issueService.getIssueStatistics();
    }
}
