package com.urbanissue.controller;

import com.urbanissue.model.Issue;
import com.urbanissue.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@RestController
@RequestMapping("/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping("/create/{citizenId}")
    public Issue createIssue(@RequestParam("title") String title,
                             @RequestParam("description") String description,
                             @RequestParam("category") String category,
                             @RequestParam("priority") String priority,
                             @RequestParam("location") String location,
                             @RequestParam(value="image", required=false) MultipartFile image,
                             @PathVariable Long citizenId
                             ) throws Exception {

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

        Path path = Paths.get("uploads/" + fileName);
        Files.write(path, image.getBytes());

        Issue issue = new Issue();
        issue.setTitle(title);
        issue.setDescription(description);
        issue.setCategory(category);
        issue.setPriority(priority);
        issue.setLocation(location);
        issue.setImagePath(fileName);

        return issueService.createIssue(issue, citizenId);
    }

    @GetMapping("/open")
    public List<Issue> getOpenIssues() {
        return issueService.getOpenIssues();
    }

    @PutMapping("/resolve/{issueId}/{workerId}")
    public Issue resolveIssue(@PathVariable Long issueId,
                              @PathVariable Long workerId) {
        return issueService.resolveIssue(issueId, workerId);
    }

    @PutMapping("/assign/{issueId}/{workerId}/{adminId}")
    public Issue assignWorker(@PathVariable Long issueId,
                              @PathVariable Long workerId,
                              @PathVariable Long adminId){
        return issueService.assignWorker(issueId, workerId, adminId);
    }

    @GetMapping("/worker/{workerId}")
    public List<Issue> getWorkerIssues(@PathVariable Long workerId) {
        return issueService.getIssuesForWorker(workerId);
    }

    @GetMapping("/citizen/{citizenId}")
    public List<Issue> getIssuesByCitizenId(@PathVariable Long citizenId) {
        return issueService.getIssuesByCitizenId(citizenId);
    }

    @GetMapping("/status/{status}")
    public List<Issue> getIssuesByStatus(@PathVariable String status) {
        return issueService.getIssuesByStatus(status);
    }

    @GetMapping("/worker/{workerId}/status/{status}")
    public List<Issue> getWorkerIssuesByStatus(
            @PathVariable Long workerId, @PathVariable String status) {
        return issueService.getWorkerIssuesByStatus(workerId, status);
    }

    @GetMapping("worker/stats/{workerId}")
    public Map<String, Long> getWorkerStatus(@PathVariable Long workerId) {
        return issueService.getWorkerStatistics(workerId);
    }
}
