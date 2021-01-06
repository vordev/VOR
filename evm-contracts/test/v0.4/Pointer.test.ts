import { contract, matchers, setup } from '@chainlink/test-helpers'
import { assert } from 'chai'
import { PointerFactory } from '../../ethers/v0.4/PointerFactory'

const pointerFactory = new PointerFactory()
const linkTokenFactory = new contract.LinkTokenFactory()
const provider = setup.provider()

let roles: setup.Roles

beforeAll(async () => {
  const users = await setup.users(provider)

  roles = users.roles
})

describe('Pointer', () => {
  let pointer: contract.Instance<PointerFactory>
  let link: contract.Instance<contract.LinkTokenFactory>
  const deployment = setup.snapshot(provider, async () => {
    link = await linkTokenFactory.connect(roles.defaultAccount).deploy()
    pointer = await pointerFactory
      .connect(roles.defaultAccount)
      .deploy(link.address)
  })

  beforeEach(async () => {
    await deployment()
  })

  it('has a limited public interface', () => {
    matchers.publicAbi(pointer, ['getAddress'])
  })

  describe('#getAddress', () => {
    it('returns the LINK token address', async () => {
      assert.equal(await pointer.getAddress(), link.address)
    })
  })
})
