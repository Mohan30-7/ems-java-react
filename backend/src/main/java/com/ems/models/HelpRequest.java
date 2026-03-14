package com.ems.models;

import jakarta.persistence.*;

@Entity
@Table(name = "help_requests")
public class HelpRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String content;

  @Column(columnDefinition = "TEXT")
  private String adminReply;

  private String status;

  private String repliedByAdmin;

  public HelpRequest() {}

  public HelpRequest(User user, String content, String status) {
    this.user = user;
    this.content = content;
    this.status = status;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getAdminReply() {
    return adminReply;
  }

  public void setAdminReply(String adminReply) {
    this.adminReply = adminReply;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getRepliedByAdmin() {
    return repliedByAdmin;
  }

  public void setRepliedByAdmin(String repliedByAdmin) {
    this.repliedByAdmin = repliedByAdmin;
  }
}
