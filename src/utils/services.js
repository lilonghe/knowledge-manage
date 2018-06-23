import request from './request';

export function GetAllKnowledge() {
	return request("knowledge/all");
}