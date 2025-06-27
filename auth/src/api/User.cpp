#include "User.hpp"

int User::getId() const { return m_id; }
const std::string& User::getUsername() const { return m_username; }
const std::string& User::getEmail() const { return m_email; }
const std::string& User::getName() const { return m_name; }
const std::string& User::getCreatedAt() const {return m_createdAt; }

void User::setId(int id) { m_id = id; }
void User::setUsername(const std::string& username) { m_username = username; }
void User::setEmail(const std::string& email) { m_email = email; }
void User::setName(const std::string& name) { m_name = name; }
void User::setCreatedAt(const std::string& createdAt) { m_createdAt = createdAt; }
