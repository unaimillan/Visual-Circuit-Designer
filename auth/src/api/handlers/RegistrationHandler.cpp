#include "RegistrationHandler.hpp"

#include "../PasswordHasher.hpp"

#include <Poco/Exception.h>
#include <Poco/Logger.h>
#include <Poco/Net/HTTPResponse.h>
#include <Poco/Net/HTTPServerRequest.h>
#include <Poco/Net/HTTPServerResponse.h>
#include <Poco/Util/Application.h>
#include <Poco/JSON/Parser.h>
#include <Poco/JSON/Object.h>
#include <Poco/Dynamic/Var.h>
#include <Poco/Data/PostgreSQL/PostgreSQLException.h>
#include <string>

using Poco::Net::HTTPResponse;
using Poco::Net::HTTPServerRequest;
using Poco::Net::HTTPServerResponse;
using Poco::Util::Application;
using Poco::Logger;
using Poco::JSON::Parser;
using Poco::Dynamic::Var;
using Poco::JSON::Object;

RegistrationHandler::RegistrationHandler(DBConnector& db): m_db(db) {}

void RegistrationHandler::handleRequest(
    HTTPServerRequest& request, HTTPServerResponse& response
) {
    Logger& logger = Application::instance().logger();
    logger.information("POST /api/register from %s", request.clientAddress().toString());

    try {
        if (!request.hasContentLength()) {
            response.setStatusAndReason(HTTPResponse::HTTP_LENGTH_REQUIRED);
            response.send();
        } else {
            Parser parser;
            PasswordHasher hasher;
            UserCredentials newUser;
            Var result = parser.parse(request.stream());
            Object::Ptr JSONObject = result.extract<Object::Ptr>();

            newUser.name = JSONObject->getValue<std::string>("name");
            newUser.username = JSONObject->getValue<std::string>("username");
            newUser.email = JSONObject->getValue<std::string>("email");
            newUser.salt = hasher.genSalt();
            newUser.passwordHash = hasher.encryptPassword(JSONObject->getValue<std::string>("password"), newUser.salt);

            m_db.createUser(newUser);

            response.setStatusAndReason(HTTPResponse::HTTP_CREATED);
            response.send();
        }
    } catch(const Poco::Data::PostgreSQL::StatementException& e) {
        response.setStatusAndReason(HTTPResponse::HTTP_CONFLICT);
        response.send();
    } catch (const Poco::Exception& e) {
        response.setStatusAndReason(HTTPResponse::HTTP_INTERNAL_SERVER_ERROR);
        response.send();
        logger.error("POST /api/register: Exception %s\n: %s\n", std::string(e.className()), e.displayText());
    }
}

