import SpiderConfig from '../../Domain/Entity/SpiderConfig';
export default interface IWeb3IndexerValidator {
    ValidateAddress(spiderConfig: SpiderConfig);
}