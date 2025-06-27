#include "User.hpp"

int User::getId() const { return m_id; }

std::string const& User::getUsername() const { return m_username; }

std::string const& User::getEmail() const { return m_email; }

std::string const& User::getName() const { return m_name; }

std::string const& User::getCreatedAt() const { return m_createdAt; }

void User::setId(int id) { m_id = id; }

void User::setUsername(std::string const& username) { m_username = username; }

void User::setEmail(std::string const& email) { m_email = email; }

void User::setName(std::string const& name) { m_name = name; }

void User::setCreatedAt(std::string const& createdAt) {
  m_createdAt = createdAt;
}
