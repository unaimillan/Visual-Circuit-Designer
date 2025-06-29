#pragma once

#include <Poco/JWT/Signer.h>
#include <string>
#include "User.hpp"

using Poco::JWT::Signer;

class TokenManager {
public:
    TokenManager();
public:
    std::string generate(const User& user);
private:
    Signer m_signer;
};