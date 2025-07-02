#pragma once

#include <Poco/Net/HTTPRequestHandler.h>
#include "../DBConnector.hpp"
#include "../TokenManager.hpp"

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPServerRequest;
using Poco::Net::HTTPServerResponse;

class VerificationHandler : public HTTPRequestHandler {
public:
  VerificationHandler(DBConnector& db, TokenManager& tokenManager);

public:
  void handleRequest(HTTPServerRequest &request, HTTPServerResponse &response) override;

private:
  DBConnector& m_db;
  TokenManager& m_tokenManager;
};