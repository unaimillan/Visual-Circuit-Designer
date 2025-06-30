#pragma once

#include "User.hpp"

#include <Poco/JWT/Signer.h>
#include <Poco/JWT/Token.h>
#include <string>

using Poco::JWT::Signer;

namespace Poco::JWT {}

class TokenManager {
public:
  enum Type {
    ACCESS,
    REFRESH,
    ANY
  };
public:
  TokenManager();

public:
  std::string generate(User const& user) const;

  bool verify(const std::string& token, Type type = ANY) const;

  User getUser(const std::string& token) const;

private:
  Signer m_signer;
};
