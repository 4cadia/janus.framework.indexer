import IndexRequest from '../../Domain/Entity/IndexRequest';
export default interface ISpiderService {
    AddContent(IndexRequest: IndexRequest, callback: any);
}