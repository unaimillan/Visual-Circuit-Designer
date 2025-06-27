#pragma once
#include "DBConnector.hpp"
#include <Poco/Net/HTTPRequestHandlerFactory.h>

using Poco::Net::HTTPRequestHandler;
using Poco::Net::HTTPRequestHandlerFactory;
using Poco::Net::HTTPServerRequest;

class AuthRequestHandlerFactory : public HTTPRequestHandlerFactory {
public:
  AuthRequestHandlerFactory(DBConnector& db);

public:
  HTTPRequestHandler*
  createRequestHandler(HTTPServerRequest const& request) override;

private:
  DBConnector& m_db;
};
