#pragma once
#include <string>

class User {
public:
  int                getId() const;
  std::string const& getUsername() const;
  std::string const& getEmail() const;
  std::string const& getName() const;
  std::string const& getCreatedAt() const;

  void setId(int id);
  void setUsername(std::string const& username);
  void setEmail(std::string const& email);
  void setName(std::string const& name);
  void setCreatedAt(std::string const& createdAt);

private:
  int         m_id;
  std::string m_username;
  std::string m_email;
  std::string m_name;
  std::string m_createdAt;
};
