import * as admin from "firebase-admin";
import { CreateRequest } from "firebase-admin/auth";
import * as functions from "firebase-functions";
import * as logger from "firebase-functions/logger";
import { User } from "./model/user";

admin.initializeApp();

export const deleteUser = functions.https.onCall((data: functions.https.CallableRequest<User>, context) => {
    try {
        if (data.data.id) {
            admin.auth().deleteUser(data.data.id);
            return true;
        } else {
            throw new Error("User ID is undefined.");
        }
    } catch (error) {
        logger.error("Error eliminando el usuario", error);
        return false;
    }
});

export const createUser = functions.https.onCall(async (data: functions.https.CallableRequest<User>, context) => {
    try {
        logger.info(context);
        if (!data || !data.data) {
            logger.error("Datos incompletos o incorrectos.");
            return;
        }

        const { fullname, email, password, phoneNumber } = data.data;

        logger.info("usuario a crear:", data.data);

        const request: CreateRequest = {
            displayName: fullname,
            email: email,
            password: password,
            phoneNumber: "+57" + phoneNumber,
            emailVerified: false,
            disabled: false,
        };

        const customClaims = {
            role: "user",
            companyId: data.auth?.uid,
        };
        const result = await admin.auth().createUser(request);

        await admin.auth().setCustomUserClaims(result.uid, customClaims);

        return true;
    } catch (error) {
        logger.error(`Error al crear usuario: ${error}`);
        return;
    }
});

export const addCustomClaimsOnCreate = functions.identity.beforeUserCreated(async (event: functions.identity.AuthBlockingEvent) => {
    try {
        const customClaims = {
            rol: "user",
            companyID: event.auth?.uid,
        };
        return {
            customClaims: customClaims,
        };
    } catch (error) {
        logger.error(`Error al agregar custom claims: ${error}`);
        return;
    }
});
